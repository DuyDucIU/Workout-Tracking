package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.plan.SessionDto;
import com.duyduciu.workout_tracking.entity.WorkoutSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {SessionExerciseMapper.class})
public interface WorkoutSessionMapper {
    @Mapping(source = "plan.id", target = "planId")
    SessionDto toDto(WorkoutSession session);
}
