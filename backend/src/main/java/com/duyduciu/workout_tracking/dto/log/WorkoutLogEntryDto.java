package com.duyduciu.workout_tracking.dto.log;

import java.math.BigDecimal;

public record WorkoutLogEntryDto(
        Long id,
        Long exerciseId,
        String exerciseNameSnap,
        Integer actualSets,
        Integer actualReps,
        BigDecimal actualWeightKg,
        String notes
) {}
