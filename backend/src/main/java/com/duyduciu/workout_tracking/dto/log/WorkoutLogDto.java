package com.duyduciu.workout_tracking.dto.log;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record WorkoutLogDto(
        Long id,
        Long planId,
        Long sessionId,
        String planNameSnap,
        String sessionNameSnap,
        LocalDate completedDate,
        String notes,
        LocalDateTime createdAt,
        List<WorkoutLogEntryDto> entries
) {}
