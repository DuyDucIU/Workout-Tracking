package com.duyduciu.workout_tracking.dto.plan;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
public record CreateSessionExerciseRequest(@NotNull Long exerciseId, @Min(1) int sets, @Min(1) int reps, BigDecimal weightKg, String notes, Integer orderIndex) {}
