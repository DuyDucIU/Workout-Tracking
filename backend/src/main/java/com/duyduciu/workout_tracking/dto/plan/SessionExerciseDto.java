package com.duyduciu.workout_tracking.dto.plan;
import com.duyduciu.workout_tracking.dto.exercise.ExerciseDto;
import java.math.BigDecimal;
public record SessionExerciseDto(Long id, Long sessionId, ExerciseDto exercise, Integer sets, Integer reps, BigDecimal weightKg, String notes, Integer orderIndex) {}
