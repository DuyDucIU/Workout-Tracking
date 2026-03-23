package com.duyduciu.workout_tracking.dto.plan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record UpdateSessionExerciseRequest(
        @Min(value = 1, message = "Sets must be at least 1") Integer sets,
        @Min(value = 1, message = "Reps must be at least 1") Integer reps,
        @DecimalMin(value = "0", message = "Weight cannot be negative") BigDecimal weightKg,
        @Size(max = 500) String notes,
        Integer orderIndex
) {}
