package com.duyduciu.workout_tracking.controller;

import com.duyduciu.workout_tracking.dto.exercise.ExerciseDto;
import com.duyduciu.workout_tracking.enums.ExerciseCategory;
import com.duyduciu.workout_tracking.enums.MuscleGroup;
import com.duyduciu.workout_tracking.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<Page<ExerciseDto>> list(
            @RequestParam(required = false) ExerciseCategory category,
            @RequestParam(required = false) MuscleGroup muscleGroup,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(exerciseService.list(category, muscleGroup, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getById(id));
    }
}
