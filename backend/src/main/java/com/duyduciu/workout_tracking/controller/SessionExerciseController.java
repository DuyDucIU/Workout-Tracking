package com.duyduciu.workout_tracking.controller;

import com.duyduciu.workout_tracking.dto.plan.*;
import com.duyduciu.workout_tracking.service.SessionExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Session Exercises")
@SecurityRequirement(name = "bearerAuth")
public class SessionExerciseController {
    private final SessionExerciseService seService;

    @PostMapping("/api/v1/sessions/{sessionId}/exercises")
    @Operation(summary = "Add an exercise to a session")
    public ResponseEntity<SessionExerciseDto> create(@PathVariable Long sessionId, @Valid @RequestBody CreateSessionExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seService.create(sessionId, request));
    }

    @PatchMapping("/api/v1/session-exercises/{id}")
    @Operation(summary = "Update a session exercise")
    public ResponseEntity<SessionExerciseDto> update(@PathVariable Long id, @Valid @RequestBody UpdateSessionExerciseRequest request) {
        return ResponseEntity.ok(seService.update(id, request));
    }

    @DeleteMapping("/api/v1/session-exercises/{id}")
    @Operation(summary = "Delete a session exercise")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        seService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
