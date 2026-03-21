package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.plan.*;
import com.duyduciu.workout_tracking.entity.Exercise;
import com.duyduciu.workout_tracking.entity.SessionExercise;
import com.duyduciu.workout_tracking.entity.WorkoutSession;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.SessionExerciseMapper;
import com.duyduciu.workout_tracking.repository.ExerciseRepository;
import com.duyduciu.workout_tracking.repository.SessionExerciseRepository;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SessionExerciseService {
    private final SessionExerciseRepository seRepo;
    private final WorkoutSessionRepository sessionRepo;
    private final ExerciseRepository exerciseRepo;
    private final SessionExerciseMapper seMapper;
    private final UserRepository userRepo;

    @Transactional
    public SessionExerciseDto create(Long sessionId, CreateSessionExerciseRequest request) {
        Long userId = getCurrentUserId();
        WorkoutSession session = findSessionOrThrow(sessionId);
        assertOwnership(session.getPlan().getUser().getId(), userId);
        Exercise exercise = exerciseRepo.findById(request.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        SessionExercise se = SessionExercise.builder()
                .session(session)
                .exercise(exercise)
                .sets(request.sets())
                .reps(request.reps())
                .weightKg(request.weightKg())
                .notes(request.notes())
                .orderIndex(request.orderIndex())
                .build();
        return seMapper.toDto(seRepo.save(se));
    }

    @Transactional
    public SessionExerciseDto update(Long seId, UpdateSessionExerciseRequest request) {
        Long userId = getCurrentUserId();
        SessionExercise se = findSeOrThrow(seId);
        assertOwnership(se.getSession().getPlan().getUser().getId(), userId);
        if (request.sets() != null) se.setSets(request.sets());
        if (request.reps() != null) se.setReps(request.reps());
        if (request.weightKg() != null) se.setWeightKg(request.weightKg());
        if (request.notes() != null) se.setNotes(request.notes());
        if (request.orderIndex() != null) se.setOrderIndex(request.orderIndex());
        return seMapper.toDto(seRepo.save(se));
    }

    @Transactional
    public void delete(Long seId) {
        Long userId = getCurrentUserId();
        SessionExercise se = findSeOrThrow(seId);
        assertOwnership(se.getSession().getPlan().getUser().getId(), userId);
        seRepo.delete(se);
    }

    private WorkoutSession findSessionOrThrow(Long sessionId) {
        return sessionRepo.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout session not found"));
    }

    private SessionExercise findSeOrThrow(Long seId) {
        return seRepo.findById(seId)
                .orElseThrow(() -> new ResourceNotFoundException("Session exercise not found"));
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
