package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.exercise.ExerciseDto;
import com.duyduciu.workout_tracking.entity.Exercise;
import com.duyduciu.workout_tracking.enums.ExerciseCategory;
import com.duyduciu.workout_tracking.enums.MuscleGroup;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.ExerciseMapper;
import com.duyduciu.workout_tracking.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    public Page<ExerciseDto> list(ExerciseCategory category, MuscleGroup muscleGroup, String search, Pageable pageable) {
        Specification<Exercise> spec = (root, query, cb) -> cb.conjunction();

        if (category != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }
        if (muscleGroup != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("muscleGroup"), muscleGroup));
        }
        if (search != null && !search.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
        }

        return exerciseRepository.findAll(spec, pageable).map(exerciseMapper::toDto);
    }

    public ExerciseDto getById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        return exerciseMapper.toDto(exercise);
    }
}
