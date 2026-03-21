package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<WorkoutPlan> findByUserIdAndIsActiveTrue(Long userId);
}
