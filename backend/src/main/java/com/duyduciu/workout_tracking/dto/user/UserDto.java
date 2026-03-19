package com.duyduciu.workout_tracking.dto.user;

import com.duyduciu.workout_tracking.enums.UnitPreference;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String email,
        String username,
        UnitPreference unitPref,
        LocalDateTime createdAt
) {
}
