package com.duyduciu.workout_tracking.dto.plan;
import com.duyduciu.workout_tracking.enums.WorkoutDayOfWeek;
public record UpdateSessionRequest(String name, WorkoutDayOfWeek dayOfWeek, Integer orderIndex) {}
