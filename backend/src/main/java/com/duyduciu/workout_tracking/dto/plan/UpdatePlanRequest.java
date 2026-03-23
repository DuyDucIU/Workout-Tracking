package com.duyduciu.workout_tracking.dto.plan;

import jakarta.validation.constraints.Size;

public record UpdatePlanRequest(
        @Size(min = 1, max = 100) String name,
        @Size(max = 500) String description,
        Boolean isActive
) {}
