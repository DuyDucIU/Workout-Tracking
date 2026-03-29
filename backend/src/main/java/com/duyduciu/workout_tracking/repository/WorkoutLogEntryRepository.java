package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface WorkoutLogEntryRepository extends JpaRepository<WorkoutLogEntry, Long> {

    @Query("""
        SELECT l.completedDate as date,
               MAX(e.actualWeightKg) as maxWeightKg,
               SUM(e.actualSets * e.actualReps * e.actualWeightKg) as totalVolumeKg,
               SUM(e.actualSets * e.actualReps) as totalReps
        FROM WorkoutLogEntry e
        JOIN e.log l
        WHERE l.user.id = :userId
          AND e.exercise.id = :exerciseId
          AND l.completedDate BETWEEN :from AND :to
          AND e.actualWeightKg IS NOT NULL
        GROUP BY l.completedDate
        ORDER BY l.completedDate ASC
        """)
    List<Object[]> findProgressData(
        @Param("userId") Long userId,
        @Param("exerciseId") Long exerciseId,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );

    @Query("""
        SELECT COALESCE(SUM(e.actualSets * e.actualReps * e.actualWeightKg), 0)
        FROM WorkoutLogEntry e
        JOIN e.log l
        WHERE l.user.id = :userId
          AND e.actualWeightKg IS NOT NULL
        """)
    BigDecimal findTotalVolumeByUserId(@Param("userId") Long userId);

    @Query(value = """
        SELECT e.exercise_id,
               MAX(e.exercise_name_snap) AS exercise_name_snap,
               MAX(e.actual_weight_kg)   AS max_weight,
               MIN(l.completed_date)     AS achieved_date
        FROM workout_log_entries e
        INNER JOIN workout_logs l ON e.log_id = l.id
        WHERE l.user_id = :userId
          AND e.actual_weight_kg IS NOT NULL
          AND e.exercise_id IS NOT NULL
          AND e.actual_weight_kg = (
              SELECT MAX(e2.actual_weight_kg)
              FROM workout_log_entries e2
              INNER JOIN workout_logs l2 ON e2.log_id = l2.id
              WHERE l2.user_id = :userId
                AND e2.exercise_id = e.exercise_id
                AND e2.actual_weight_kg IS NOT NULL
          )
        GROUP BY e.exercise_id
        ORDER BY max_weight DESC
        """, nativeQuery = true)
    List<Object[]> findPersonalRecords(@Param("userId") Long userId);
}
