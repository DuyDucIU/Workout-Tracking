package com.duyduciu.workout_tracking.controller;

import com.duyduciu.workout_tracking.dto.plan.*;
import com.duyduciu.workout_tracking.service.WorkoutSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Workout Sessions")
@SecurityRequirement(name = "bearerAuth")
public class WorkoutSessionController {
    private final WorkoutSessionService sessionService;

    @GetMapping("/api/v1/workout-plans/{planId}/sessions")
    @Operation(summary = "List sessions for a plan")
    public ResponseEntity<List<SessionDto>> list(@PathVariable Long planId) {
        return ResponseEntity.ok(sessionService.list(planId));
    }

    @PostMapping("/api/v1/workout-plans/{planId}/sessions")
    @Operation(summary = "Add a session to a plan")
    public ResponseEntity<SessionDto> create(@PathVariable Long planId, @Valid @RequestBody CreateSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.create(planId, request));
    }

    @GetMapping("/api/v1/sessions/{id}")
    @Operation(summary = "Get a session by ID")
    public ResponseEntity<SessionDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getById(id));
    }

    @PatchMapping("/api/v1/sessions/{id}")
    @Operation(summary = "Update a session")
    public ResponseEntity<SessionDto> update(@PathVariable Long id, @Valid @RequestBody UpdateSessionRequest request) {
        return ResponseEntity.ok(sessionService.update(id, request));
    }

    @DeleteMapping("/api/v1/sessions/{id}")
    @Operation(summary = "Delete a session")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sessionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
