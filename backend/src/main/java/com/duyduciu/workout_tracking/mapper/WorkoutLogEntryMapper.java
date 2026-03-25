package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.log.WorkoutLogEntryDto;
import com.duyduciu.workout_tracking.entity.WorkoutLogEntry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface WorkoutLogEntryMapper {
    @Mapping(target = "exerciseId", source = "entry", qualifiedByName = "exerciseId")
    WorkoutLogEntryDto toDto(WorkoutLogEntry entry);

    @Named("exerciseId")
    default Long mapExerciseId(WorkoutLogEntry entry) {
        return entry.getExercise() != null ? entry.getExercise().getId() : null;
    }
}
