package com.duyduciu.workout_tracking.controller;

import com.duyduciu.workout_tracking.dto.plan.*;
import com.duyduciu.workout_tracking.service.WorkoutPlanService;
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
@RequestMapping("/api/v1/workout-plans")
@RequiredArgsConstructor
@Tag(name = "Workout Plans")
@SecurityRequirement(name = "bearerAuth")
public class WorkoutPlanController {
    private final WorkoutPlanService planService;

    @GetMapping
    @Operation(summary = "List all plans for current user")
    public ResponseEntity<List<WorkoutPlanDto>> list() {
        return ResponseEntity.ok(planService.list());
    }

    @PostMapping
    @Operation(summary = "Create a new workout plan")
    public ResponseEntity<WorkoutPlanDto> create(@Valid @RequestBody CreatePlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a workout plan by ID")
    public ResponseEntity<WorkoutPlanDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getById(id));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a workout plan")
    public ResponseEntity<WorkoutPlanDto> update(@PathVariable Long id, @RequestBody UpdatePlanRequest request) {
        return ResponseEntity.ok(planService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a workout plan")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
