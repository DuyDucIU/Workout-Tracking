package com.duyduciu.workout_tracking.repository;

import com.duyduciu.workout_tracking.entity.SessionExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionExerciseRepository extends JpaRepository<SessionExercise, Long> {
    List<SessionExercise> findBySessionIdOrderByOrderIndex(Long sessionId);
}
