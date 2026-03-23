package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.plan.*;
import com.duyduciu.workout_tracking.entity.User;
import com.duyduciu.workout_tracking.entity.WorkoutPlan;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.WorkoutPlanMapper;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutPlanService {
    private final WorkoutPlanRepository planRepo;
    private final WorkoutPlanMapper planMapper;
    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    public List<WorkoutPlanDto> list() {
        Long userId = getCurrentUserId();
        return planRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(planMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public WorkoutPlanDto getById(Long planId) {
        Long userId = getCurrentUserId();
        WorkoutPlan plan = findPlanOrThrow(planId);
        assertOwnership(plan.getUser().getId(), userId);
        return planMapper.toDto(plan);
    }

    @Transactional
    public WorkoutPlanDto create(CreatePlanRequest request) {
        User user = userRepo.findByEmail(getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        WorkoutPlan plan = WorkoutPlan.builder()
                .user(user)
                .name(request.name())
                .description(request.description())
                .isActive(request.isActive())
                .build();
        return planMapper.toDto(planRepo.save(plan));
    }

    @Transactional
    public WorkoutPlanDto update(Long planId, UpdatePlanRequest request) {
        Long userId = getCurrentUserId();
        WorkoutPlan plan = findPlanOrThrow(planId);
        assertOwnership(plan.getUser().getId(), userId);
        if (request.name() != null) plan.setName(request.name());
        if (request.description() != null) plan.setDescription(request.description());
        if (request.isActive() != null) plan.setActive(request.isActive());
        return planMapper.toDto(planRepo.save(plan));
    }

    @Transactional
    public void delete(Long planId) {
        Long userId = getCurrentUserId();
        WorkoutPlan plan = findPlanOrThrow(planId);
        assertOwnership(plan.getUser().getId(), userId);
        planRepo.delete(plan);
    }

    private WorkoutPlan findPlanOrThrow(Long planId) {
        return planRepo.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found"));
    }

    private void assertOwnership(Long resourceUserId, Long currentUserId) {
        if (!resourceUserId.equals(currentUserId)) {
            throw new AccessDeniedException("You do not have access to this resource");
        }
    }

    private String getEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private Long getCurrentUserId() {
        return userRepo.findByEmail(getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }
}
