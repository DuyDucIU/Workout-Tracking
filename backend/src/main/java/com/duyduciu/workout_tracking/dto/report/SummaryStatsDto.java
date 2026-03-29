package com.duyduciu.workout_tracking.dto.report;

import java.math.BigDecimal;

public record SummaryStatsDto(
    long totalWorkouts,
    BigDecimal totalVolumeKg,
    int currentStreak,
    int longestStreak
) {}
