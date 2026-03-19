package com.duyduciu.workout_tracking.dto.user;

import com.duyduciu.workout_tracking.enums.UnitPreference;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
        String username,

        UnitPreference unitPref
) {
}
