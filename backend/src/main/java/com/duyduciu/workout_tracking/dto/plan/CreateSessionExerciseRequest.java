package com.duyduciu.workout_tracking.dto.plan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CreateSessionExerciseRequest(
        @NotNull Long exerciseId,
        @Min(1) int sets,
        @Min(1) int reps,
        @DecimalMin(value = "0", message = "Weight cannot be negative") BigDecimal weightKg,
        @Size(max = 500) String notes,
        Integer orderIndex
) {}
