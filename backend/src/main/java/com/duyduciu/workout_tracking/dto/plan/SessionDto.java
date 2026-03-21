package com.duyduciu.workout_tracking.dto.plan;
import com.duyduciu.workout_tracking.enums.WorkoutDayOfWeek;
import java.util.List;
public record SessionDto(Long id, Long planId, String name, WorkoutDayOfWeek dayOfWeek, Integer orderIndex, List<SessionExerciseDto> exercises) {}
