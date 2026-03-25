package com.duyduciu.workout_tracking.dto.log;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateLogEntryRequest(
        @NotNull Long exerciseId,
        @NotNull @Min(1) @Max(100) Integer actualSets,
        @NotNull @Min(1) @Max(1000) Integer actualReps,
        BigDecimal actualWeightKg,
        @Size(max = 500) String notes
) {}
