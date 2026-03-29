package com.duyduciu.workout_tracking.controller;

import com.duyduciu.workout_tracking.dto.report.*;
import com.duyduciu.workout_tracking.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/progress/{exerciseId}")
    @Operation(summary = "Get progress data for an exercise over time")
    public ResponseEntity<List<ProgressDataPointDto>> getProgress(
            @PathVariable Long exerciseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(reportService.getProgressData(exerciseId, from, to));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get summary stats for current user")
    public ResponseEntity<SummaryStatsDto> getSummary() {
        return ResponseEntity.ok(reportService.getSummaryStats());
    }

    @GetMapping("/records")
    @Operation(summary = "Get personal records per exercise")
    public ResponseEntity<List<PersonalRecordDto>> getRecords() {
        return ResponseEntity.ok(reportService.getPersonalRecords());
    }
}
