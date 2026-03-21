package com.duyduciu.workout_tracking.dto.plan;
import java.math.BigDecimal;
public record UpdateSessionExerciseRequest(Integer sets, Integer reps, BigDecimal weightKg, String notes, Integer orderIndex) {}
