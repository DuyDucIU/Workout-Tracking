package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.plan.*;
import com.duyduciu.workout_tracking.entity.WorkoutPlan;
import com.duyduciu.workout_tracking.entity.WorkoutSession;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.WorkoutSessionMapper;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.repository.WorkoutPlanRepository;
import com.duyduciu.workout_tracking.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutSessionService {
    private final WorkoutSessionRepository sessionRepo;
    private final WorkoutPlanRepository planRepo;
    private final WorkoutSessionMapper sessionMapper;
    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    public List<SessionDto> list(Long planId) {
        Long userId = getCurrentUserId();
        WorkoutPlan plan = findPlanOrThrow(planId);
        assertOwnership(plan.getUser().getId(), userId);
        return sessionRepo.findByPlanIdOrderByOrderIndex(planId)
                .stream().map(sessionMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public SessionDto getById(Long sessionId) {
        Long userId = getCurrentUserId();
        WorkoutSession session = findSessionOrThrow(sessionId);
        assertOwnership(session.getPlan().getUser().getId(), userId);
        return sessionMapper.toDto(session);
    }

    @Transactional
    public SessionDto create(Long planId, CreateSessionRequest request) {
        Long userId = getCurrentUserId();
        WorkoutPlan plan = findPlanOrThrow(planId);
        assertOwnership(plan.getUser().getId(), userId);
        WorkoutSession session = WorkoutSession.builder()
                .plan(plan)
                .name(request.name())
                .dayOfWeek(request.dayOfWeek())
                .orderIndex(request.orderIndex())
                .build();
        return sessionMapper.toDto(sessionRepo.save(session));
    }

    @Transactional
    public SessionDto update(Long sessionId, UpdateSessionRequest request) {
        Long userId = getCurrentUserId();
        WorkoutSession session = findSessionOrThrow(sessionId);
        assertOwnership(session.getPlan().getUser().getId(), userId);
        if (request.name() != null) session.setName(request.name());
        if (request.dayOfWeek() != null) session.setDayOfWeek(request.dayOfWeek());
        if (request.orderIndex() != null) session.setOrderIndex(request.orderIndex());
        return sessionMapper.toDto(sessionRepo.save(session));
    }

    @Transactional
    public void delete(Long sessionId) {
        Long userId = getCurrentUserId();
        WorkoutSession session = findSessionOrThrow(sessionId);
        assertOwnership(session.getPlan().getUser().getId(), userId);
        sessionRepo.delete(session);
    }

    private WorkoutPlan findPlanOrThrow(Long planId) {
        return planRepo.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found"));
    }

    private WorkoutSession findSessionOrThrow(Long sessionId) {
        return sessionRepo.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout session not found"));
    }

    private void assertOwnership(Long resourceUserId, Long currentUserId) {
        if (!resourceUserId.equals(currentUserId)) {
            throw new AccessDeniedException("You do not have access to this resource");
        }
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }
}
