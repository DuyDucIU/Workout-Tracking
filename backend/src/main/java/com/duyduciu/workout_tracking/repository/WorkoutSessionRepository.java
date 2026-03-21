package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByPlanIdOrderByOrderIndex(Long planId);
}
