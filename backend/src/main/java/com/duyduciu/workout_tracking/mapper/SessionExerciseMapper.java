package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.plan.SessionExerciseDto;
import com.duyduciu.workout_tracking.entity.SessionExercise;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ExerciseMapper.class})
public interface SessionExerciseMapper {
    @Mapping(source = "session.id", target = "sessionId")
    SessionExerciseDto toDto(SessionExercise sessionExercise);
}
