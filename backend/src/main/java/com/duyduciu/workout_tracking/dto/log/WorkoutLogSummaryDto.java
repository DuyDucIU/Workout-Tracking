package com.duyduciu.workout_tracking.dto.log;

import java.time.LocalDate;

public record WorkoutLogSummaryDto(
        Long id,
        String planNameSnap,
        String sessionNameSnap,
        LocalDate completedDate,
        int entryCount
) {}
