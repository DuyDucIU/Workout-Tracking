package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {

    @Query("SELECT DISTINCT s FROM WorkoutSession s LEFT JOIN FETCH s.exercises WHERE s.plan.id = :planId ORDER BY s.orderIndex")
    List<WorkoutSession> findByPlanIdOrderByOrderIndex(@Param("planId") Long planId);
}
