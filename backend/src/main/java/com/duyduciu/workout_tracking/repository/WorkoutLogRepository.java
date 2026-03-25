package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {

    Page<WorkoutLog> findByUserId(Long userId, Pageable pageable);

    Page<WorkoutLog> findByUserIdAndCompletedDateBetween(
            Long userId, LocalDate from, LocalDate to, Pageable pageable);

    @Query("SELECT l FROM WorkoutLog l LEFT JOIN FETCH l.entries WHERE l.id = :id")
    Optional<WorkoutLog> findByIdWithEntries(@Param("id") Long id);
}
