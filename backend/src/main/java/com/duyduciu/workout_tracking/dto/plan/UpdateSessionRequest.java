package com.duyduciu.workout_tracking.dto.plan;
import com.duyduciu.workout_tracking.enums.WorkoutDayOfWeek;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record UpdateSessionRequest(
        @NotBlank @Size(max = 100) String name,
        WorkoutDayOfWeek dayOfWeek,
        Integer orderIndex
) {}
