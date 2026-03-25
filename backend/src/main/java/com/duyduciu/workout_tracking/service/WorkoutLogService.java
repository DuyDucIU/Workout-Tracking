package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.log.*;
import com.duyduciu.workout_tracking.entity.*;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.WorkoutLogMapper;
import com.duyduciu.workout_tracking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {
    private final WorkoutLogRepository logRepo;
    private final WorkoutPlanRepository planRepo;
    private final WorkoutSessionRepository sessionRepo;
    private final ExerciseRepository exerciseRepo;
    private final WorkoutLogMapper logMapper;
    private final UserRepository userRepo;

    private static final Sort DEFAULT_SORT = Sort.by(
            Sort.Order.desc("completedDate"),
            Sort.Order.desc("createdAt"));

    @Transactional
    public WorkoutLogDto create(CreateWorkoutLogRequest request) {
        User user = getCurrentUser();

        WorkoutPlan plan = planRepo.findById(request.planId())
                .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found"));
        assertOwnership(plan.getUser().getId(), user.getId());

        WorkoutSession session = sessionRepo.findById(request.sessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Workout session not found"));
        if (!session.getPlan().getId().equals(plan.getId())) {
            throw new ResourceNotFoundException("Session does not belong to the specified plan");
        }

        List<Long> exerciseIds = request.entries().stream()
                .map(CreateLogEntryRequest::exerciseId)
                .toList();
        Map<Long, Exercise> exerciseMap = exerciseRepo.findAllById(exerciseIds).stream()
                .collect(Collectors.toMap(Exercise::getId, Function.identity()));

        WorkoutLog log = WorkoutLog.builder()
                .user(user)
                .plan(plan)
                .session(session)
                .planNameSnap(plan.getName())
                .sessionNameSnap(session.getName())
                .completedDate(request.completedDate())
                .notes(request.notes())
                .build();

        for (CreateLogEntryRequest entryReq : request.entries()) {
            Exercise exercise = exerciseMap.get(entryReq.exerciseId());
            if (exercise == null) {
                throw new ResourceNotFoundException("Exercise not found: " + entryReq.exerciseId());
            }
            WorkoutLogEntry entry = WorkoutLogEntry.builder()
                    .log(log)
                    .exercise(exercise)
                    .exerciseNameSnap(exercise.getName())
                    .actualSets(entryReq.actualSets())
                    .actualReps(entryReq.actualReps())
                    .actualWeightKg(entryReq.actualWeightKg())
                    .notes(entryReq.notes())
                    .build();
            log.getEntries().add(entry);
        }

        return logMapper.toDto(logRepo.save(log));
    }

    @Transactional(readOnly = true)
    public Page<WorkoutLogSummaryDto> list(LocalDate from, LocalDate to, int page, int size) {
        Long userId = getCurrentUserId();
        var pageable = PageRequest.of(page, size, DEFAULT_SORT);

        Page<WorkoutLog> logs;
        if (from != null && to != null) {
            logs = logRepo.findByUserIdAndCompletedDateBetween(userId, from, to, pageable);
        } else {
            logs = logRepo.findByUserId(userId, pageable);
        }
        return logs.map(logMapper::toSummaryDto);
    }

    @Transactional(readOnly = true)
    public WorkoutLogDto getById(Long logId) {
        Long userId = getCurrentUserId();
        WorkoutLog log = logRepo.findByIdWithEntries(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout log not found"));
        assertOwnership(log.getUser().getId(), userId);
        return logMapper.toDto(log);
    }

    @Transactional
    public void delete(Long logId) {
        Long userId = getCurrentUserId();
        WorkoutLog log = logRepo.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout log not found"));
        assertOwnership(log.getUser().getId(), userId);
        logRepo.delete(log);
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
        return getCurrentUser().getId();
    }

    private User getCurrentUser() {
        return userRepo.findByEmail(getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
