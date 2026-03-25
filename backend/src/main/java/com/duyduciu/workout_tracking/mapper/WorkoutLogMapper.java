package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.log.WorkoutLogDto;
import com.duyduciu.workout_tracking.dto.log.WorkoutLogSummaryDto;
import com.duyduciu.workout_tracking.entity.WorkoutLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {WorkoutLogEntryMapper.class})
public interface WorkoutLogMapper {
    @Mapping(target = "planId", source = "log", qualifiedByName = "planId")
    @Mapping(target = "sessionId", source = "log", qualifiedByName = "sessionId")
    WorkoutLogDto toDto(WorkoutLog log);

    @Mapping(target = "entryCount", expression = "java(log.getEntries().size())")
    WorkoutLogSummaryDto toSummaryDto(WorkoutLog log);

    @Named("planId")
    default Long mapPlanId(WorkoutLog log) {
        return log.getPlan() != null ? log.getPlan().getId() : null;
    }

    @Named("sessionId")
    default Long mapSessionId(WorkoutLog log) {
        return log.getSession() != null ? log.getSession().getId() : null;
    }
}
