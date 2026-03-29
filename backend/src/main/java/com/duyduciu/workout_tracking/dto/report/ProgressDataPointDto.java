package com.duyduciu.workout_tracking.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProgressDataPointDto(
    LocalDate date,
    BigDecimal maxWeightKg,
    BigDecimal totalVolumeKg,
    Integer totalReps
) {}
