package com.duyduciu.workout_tracking.dto.plan;
import jakarta.validation.constraints.NotBlank;
public record CreatePlanRequest(@NotBlank String name, String description, boolean isActive) {}
