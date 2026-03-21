package com.duyduciu.workout_tracking.dto.exercise;

import com.duyduciu.workout_tracking.enums.ExerciseCategory;
import com.duyduciu.workout_tracking.enums.MuscleGroup;

public record ExerciseDto(
    Long id,
    String name,
    String description,
    ExerciseCategory category,
    MuscleGroup muscleGroup,
    boolean isSystem
) {}
