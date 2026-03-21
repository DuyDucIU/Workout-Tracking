package com.duyduciu.workout_tracking.dto.plan;
import com.duyduciu.workout_tracking.enums.WorkoutDayOfWeek;
import jakarta.validation.constraints.NotBlank;
public record CreateSessionRequest(@NotBlank String name, WorkoutDayOfWeek dayOfWeek, Integer orderIndex) {}
