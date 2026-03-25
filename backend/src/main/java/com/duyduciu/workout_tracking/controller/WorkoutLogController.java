package com.duyduciu.workout_tracking.controller;

import com.duyduciu.workout_tracking.dto.log.CreateWorkoutLogRequest;
import com.duyduciu.workout_tracking.dto.log.WorkoutLogDto;
import com.duyduciu.workout_tracking.dto.log.WorkoutLogSummaryDto;
import com.duyduciu.workout_tracking.service.WorkoutLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
@Tag(name = "Workout Logs")
@SecurityRequirement(name = "bearerAuth")
public class WorkoutLogController {
    private final WorkoutLogService logService;

    @PostMapping
    @Operation(summary = "Log a completed workout")
    public ResponseEntity<WorkoutLogDto> create(@Valid @RequestBody CreateWorkoutLogRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(logService.create(request));
    }

    @GetMapping
    @Operation(summary = "List workout logs for current user")
    public ResponseEntity<Page<WorkoutLogSummaryDto>> list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(logService.list(from, to, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a workout log by ID")
    public ResponseEntity<WorkoutLogDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(logService.getById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a workout log")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
