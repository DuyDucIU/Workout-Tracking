package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.plan.WorkoutPlanDto;
import com.duyduciu.workout_tracking.dto.plan.WorkoutPlanSummaryDto;
import com.duyduciu.workout_tracking.entity.WorkoutPlan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {WorkoutSessionMapper.class})
public interface WorkoutPlanMapper {
    @Mapping(target = "sessionCount", expression = "java(plan.getSessions().size())")
    @Mapping(source = "active", target = "isActive")
    WorkoutPlanDto toDto(WorkoutPlan plan);

    @Mapping(source = "active", target = "isActive")
    WorkoutPlanSummaryDto toSummaryDto(WorkoutPlan plan);
}
