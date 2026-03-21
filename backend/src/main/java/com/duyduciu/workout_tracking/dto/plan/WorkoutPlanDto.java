package com.duyduciu.workout_tracking.dto.plan;
import java.time.LocalDateTime;
import java.util.List;
public record WorkoutPlanDto(Long id, String name, String description, boolean isActive, int sessionCount, LocalDateTime createdAt, List<SessionDto> sessions) {}
