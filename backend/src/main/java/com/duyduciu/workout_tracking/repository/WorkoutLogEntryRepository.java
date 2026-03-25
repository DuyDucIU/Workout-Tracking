package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutLogEntryRepository extends JpaRepository<WorkoutLogEntry, Long> {
}
