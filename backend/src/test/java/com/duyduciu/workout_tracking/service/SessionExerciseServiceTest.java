package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.exercise.ExerciseDto;
import com.duyduciu.workout_tracking.dto.plan.CreateSessionExerciseRequest;
import com.duyduciu.workout_tracking.dto.plan.SessionExerciseDto;
import com.duyduciu.workout_tracking.entity.*;
import com.duyduciu.workout_tracking.enums.ExerciseCategory;
import com.duyduciu.workout_tracking.enums.MuscleGroup;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.SessionExerciseMapper;
import com.duyduciu.workout_tracking.repository.ExerciseRepository;
import com.duyduciu.workout_tracking.repository.SessionExerciseRepository;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.repository.WorkoutSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionExerciseServiceTest {

    @Mock SessionExerciseRepository seRepo;
    @Mock WorkoutSessionRepository sessionRepo;
    @Mock ExerciseRepository exerciseRepo;
    @Mock SessionExerciseMapper seMapper;
    @Mock UserRepository userRepo;

    @InjectMocks SessionExerciseService service;

    private User owner;
    private WorkoutPlan plan;
    private WorkoutSession session;
    private Exercise exercise;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setEmail("owner@test.com");
        owner.setUsername("owner");
        owner.setPassword("hash");

        plan = WorkoutPlan.builder()
                .id(10L)
                .user(owner)
                .name("Test Plan")
                .sessions(new ArrayList<>())
                .build();

        session = WorkoutSession.builder()
                .id(20L)
                .plan(plan)
                .name("Push Day")
                .exercises(new ArrayList<>())
                .build();

        exercise = new Exercise();
        exercise.setId(5L);
        exercise.setName("Bench Press");
        exercise.setCategory(ExerciseCategory.STRENGTH);
        exercise.setMuscleGroup(MuscleGroup.CHEST);

        Authentication auth = new UsernamePasswordAuthenticationToken("owner@test.com", null);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void create_happyPath_returnsDto() {
        CreateSessionExerciseRequest request = new CreateSessionExerciseRequest(
                5L, 3, 10, null, null, null);

        SessionExercise saved = SessionExercise.builder()
                .id(100L)
                .session(session)
                .exercise(exercise)
                .sets(3)
                .reps(10)
                .build();

        ExerciseDto exerciseDto = new ExerciseDto(5L, "Bench Press", null,
                ExerciseCategory.STRENGTH, MuscleGroup.CHEST, true);
        SessionExerciseDto expectedDto = new SessionExerciseDto(
                100L, 20L, exerciseDto, 3, 10, null, null, null);

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(sessionRepo.findById(20L)).thenReturn(Optional.of(session));
        when(exerciseRepo.findById(5L)).thenReturn(Optional.of(exercise));
        when(seRepo.save(any(SessionExercise.class))).thenReturn(saved);
        when(seMapper.toDto(saved)).thenReturn(expectedDto);

        SessionExerciseDto result = service.create(20L, request);

        assertThat(result.id()).isEqualTo(100L);
        assertThat(result.sessionId()).isEqualTo(20L);
        assertThat(result.sets()).isEqualTo(3);
        assertThat(result.reps()).isEqualTo(10);
        assertThat(result.weightKg()).isNull();
        verify(seRepo).save(any(SessionExercise.class));
    }

    @Test
    void create_withWeightAndNotes_persistsValues() {
        CreateSessionExerciseRequest request = new CreateSessionExerciseRequest(
                5L, 4, 8, new BigDecimal("80.0"), "Use wrist wraps", 2);

        SessionExercise saved = SessionExercise.builder()
                .id(101L)
                .session(session)
                .exercise(exercise)
                .sets(4)
                .reps(8)
                .weightKg(new BigDecimal("80.0"))
                .notes("Use wrist wraps")
                .orderIndex(2)
                .build();

        ExerciseDto exerciseDto = new ExerciseDto(5L, "Bench Press", null,
                ExerciseCategory.STRENGTH, MuscleGroup.CHEST, true);
        SessionExerciseDto expectedDto = new SessionExerciseDto(
                101L, 20L, exerciseDto, 4, 8, new BigDecimal("80.0"), "Use wrist wraps", 2);

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(sessionRepo.findById(20L)).thenReturn(Optional.of(session));
        when(exerciseRepo.findById(5L)).thenReturn(Optional.of(exercise));
        when(seRepo.save(any(SessionExercise.class))).thenReturn(saved);
        when(seMapper.toDto(saved)).thenReturn(expectedDto);

        SessionExerciseDto result = service.create(20L, request);

        assertThat(result.weightKg()).isEqualByComparingTo("80.0");
        assertThat(result.notes()).isEqualTo("Use wrist wraps");
        assertThat(result.orderIndex()).isEqualTo(2);
    }

    @Test
    void create_sessionNotFound_throwsResourceNotFoundException() {
        CreateSessionExerciseRequest request = new CreateSessionExerciseRequest(
                5L, 3, 10, null, null, null);

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(sessionRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(99L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout session not found");

        verify(seRepo, never()).save(any());
    }

    @Test
    void create_exerciseNotFound_throwsResourceNotFoundException() {
        CreateSessionExerciseRequest request = new CreateSessionExerciseRequest(
                999L, 3, 10, null, null, null);

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(sessionRepo.findById(20L)).thenReturn(Optional.of(session));
        when(exerciseRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(20L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Exercise not found");

        verify(seRepo, never()).save(any());
    }

    @Test
    void create_wrongUser_throwsAccessDeniedException() {
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@test.com");
        otherUser.setUsername("other");
        otherUser.setPassword("hash");

        Authentication auth = new UsernamePasswordAuthenticationToken("other@test.com", null);
        SecurityContextHolder.getContext().setAuthentication(auth);

        CreateSessionExerciseRequest request = new CreateSessionExerciseRequest(
                5L, 3, 10, null, null, null);

        when(userRepo.findByEmail("other@test.com")).thenReturn(Optional.of(otherUser));
        when(sessionRepo.findById(20L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> service.create(20L, request))
                .isInstanceOf(AccessDeniedException.class);

        verify(seRepo, never()).save(any());
    }
}
