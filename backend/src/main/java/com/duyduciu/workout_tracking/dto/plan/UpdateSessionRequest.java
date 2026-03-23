package com.duyduciu.workout_tracking.dto.plan;

import com.duyduciu.workout_tracking.enums.WorkoutDayOfWeek;
import jakarta.validation.constraints.Size;

public record UpdateSessionRequest(
        @Size(min = 1, max = 100) String name,
        WorkoutDayOfWeek dayOfWeek,
        Integer orderIndex
) {}
