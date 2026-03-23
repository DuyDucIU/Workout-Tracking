package com.duyduciu.workout_tracking.dto.plan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlanRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 500) String description,
        boolean isActive
) {}
