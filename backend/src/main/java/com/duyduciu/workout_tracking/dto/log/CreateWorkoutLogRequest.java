package com.duyduciu.workout_tracking.dto.log;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record CreateWorkoutLogRequest(
        @NotNull Long planId,
        @NotNull Long sessionId,
        @NotNull LocalDate completedDate,
        @Size(max = 2000) String notes,
        @NotEmpty @Valid List<CreateLogEntryRequest> entries
) {}
