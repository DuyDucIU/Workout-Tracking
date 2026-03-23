package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {

    @Query("SELECT DISTINCT p FROM WorkoutPlan p LEFT JOIN FETCH p.sessions WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    Optional<WorkoutPlan> findByUserIdAndIsActiveTrue(Long userId);
}
