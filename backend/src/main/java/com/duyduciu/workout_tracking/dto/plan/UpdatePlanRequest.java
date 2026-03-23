package com.duyduciu.workout_tracking.dto.plan;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record UpdatePlanRequest(
        @NotBlank @Size(max = 100) String name,
        String description,
        Boolean isActive
) {}
