package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.exercise.ExerciseDto;
import com.duyduciu.workout_tracking.entity.Exercise;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {

    @Mapping(source = "system", target = "isSystem")
    ExerciseDto toDto(Exercise exercise);
}
