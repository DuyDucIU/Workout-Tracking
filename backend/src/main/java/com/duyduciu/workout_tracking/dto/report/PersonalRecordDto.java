package com.duyduciu.workout_tracking.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PersonalRecordDto(
    Long exerciseId,
    String exerciseName,
    BigDecimal maxWeightKg,
    LocalDate achievedDate
) {}
