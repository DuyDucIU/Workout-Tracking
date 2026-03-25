package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.log.*;
import com.duyduciu.workout_tracking.entity.*;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.WorkoutLogMapper;
import com.duyduciu.workout_tracking.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutLogServiceTest {

    @Mock WorkoutLogRepository logRepo;
    @Mock WorkoutPlanRepository planRepo;
    @Mock WorkoutSessionRepository sessionRepo;
    @Mock ExerciseRepository exerciseRepo;
    @Mock WorkoutLogMapper logMapper;
    @Mock UserRepository userRepo;

    @InjectMocks WorkoutLogService service;

    private User owner;
    private WorkoutPlan plan;
    private WorkoutSession session;
    private Exercise benchPress;
    private Exercise pushUps;

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
                .name("Push Pull Legs")
                .sessions(new ArrayList<>())
                .build();

        session = WorkoutSession.builder()
                .id(20L)
                .plan(plan)
                .name("Push Day")
                .exercises(new ArrayList<>())
                .build();

        benchPress = new Exercise();
        benchPress.setId(5L);
        benchPress.setName("Bench Press");

        pushUps = new Exercise();
        pushUps.setId(6L);
        pushUps.setName("Push-ups");

        Authentication auth = new UsernamePasswordAuthenticationToken("owner@test.com", null);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void create_happyPath_snapshotsAndSaves() {
        CreateLogEntryRequest entry1 = new CreateLogEntryRequest(5L, 3, 10, new BigDecimal("80.0"), null);
        CreateLogEntryRequest entry2 = new CreateLogEntryRequest(6L, 3, 15, null, "bodyweight");
        CreateWorkoutLogRequest request = new CreateWorkoutLogRequest(
                10L, 20L, LocalDate.of(2026, 3, 25), "Great workout", List.of(entry1, entry2));

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(planRepo.findById(10L)).thenReturn(Optional.of(plan));
        when(sessionRepo.findById(20L)).thenReturn(Optional.of(session));
        when(exerciseRepo.findAllById(List.of(5L, 6L))).thenReturn(List.of(benchPress, pushUps));

        WorkoutLogDto expectedDto = new WorkoutLogDto(1L, 10L, 20L, "Push Pull Legs", "Push Day",
                LocalDate.of(2026, 3, 25), "Great workout", LocalDateTime.now(), List.of());

        ArgumentCaptor<WorkoutLog> captor = ArgumentCaptor.forClass(WorkoutLog.class);
        when(logRepo.save(captor.capture())).thenAnswer(inv -> inv.getArgument(0));
        when(logMapper.toDto(any(WorkoutLog.class))).thenReturn(expectedDto);

        WorkoutLogDto result = service.create(request);

        WorkoutLog saved = captor.getValue();
        assertThat(saved.getPlanNameSnap()).isEqualTo("Push Pull Legs");
        assertThat(saved.getSessionNameSnap()).isEqualTo("Push Day");
        assertThat(saved.getCompletedDate()).isEqualTo(LocalDate.of(2026, 3, 25));
        assertThat(saved.getEntries()).hasSize(2);
        assertThat(saved.getEntries().get(0).getExerciseNameSnap()).isEqualTo("Bench Press");
        assertThat(saved.getEntries().get(0).getActualSets()).isEqualTo(3);
        assertThat(saved.getEntries().get(0).getActualWeightKg()).isEqualByComparingTo("80.0");
        assertThat(saved.getEntries().get(1).getExerciseNameSnap()).isEqualTo("Push-ups");
        assertThat(saved.getEntries().get(1).getActualWeightKg()).isNull();
        assertThat(result).isEqualTo(expectedDto);
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

        CreateLogEntryRequest entry = new CreateLogEntryRequest(5L, 3, 10, null, null);
        CreateWorkoutLogRequest request = new CreateWorkoutLogRequest(
                10L, 20L, LocalDate.of(2026, 3, 25), null, List.of(entry));

        when(userRepo.findByEmail("other@test.com")).thenReturn(Optional.of(otherUser));
        when(planRepo.findById(10L)).thenReturn(Optional.of(plan));

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(AccessDeniedException.class);

        verify(logRepo, never()).save(any());
    }

    @Test
    void create_sessionNotInPlan_throwsResourceNotFoundException() {
        WorkoutPlan otherPlan = WorkoutPlan.builder()
                .id(99L)
                .user(owner)
                .name("Other Plan")
                .sessions(new ArrayList<>())
                .build();

        WorkoutSession otherSession = WorkoutSession.builder()
                .id(30L)
                .plan(otherPlan)
                .name("Leg Day")
                .exercises(new ArrayList<>())
                .build();

        CreateLogEntryRequest entry = new CreateLogEntryRequest(5L, 3, 10, null, null);
        CreateWorkoutLogRequest request = new CreateWorkoutLogRequest(
                10L, 30L, LocalDate.of(2026, 3, 25), null, List.of(entry));

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(planRepo.findById(10L)).thenReturn(Optional.of(plan));
        when(sessionRepo.findById(30L)).thenReturn(Optional.of(otherSession));

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Session does not belong");

        verify(logRepo, never()).save(any());
    }

    @Test
    void create_planNotFound_throwsResourceNotFoundException() {
        CreateLogEntryRequest entry = new CreateLogEntryRequest(5L, 3, 10, null, null);
        CreateWorkoutLogRequest request = new CreateWorkoutLogRequest(
                999L, 20L, LocalDate.of(2026, 3, 25), null, List.of(entry));

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(planRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout plan not found");

        verify(logRepo, never()).save(any());
    }

    @Test
    void getById_happyPath_returnsDto() {
        WorkoutLog log = WorkoutLog.builder()
                .id(1L)
                .user(owner)
                .plan(plan)
                .session(session)
                .planNameSnap("Push Pull Legs")
                .sessionNameSnap("Push Day")
                .completedDate(LocalDate.of(2026, 3, 25))
                .build();

        WorkoutLogDto expectedDto = new WorkoutLogDto(1L, 10L, 20L, "Push Pull Legs", "Push Day",
                LocalDate.of(2026, 3, 25), null, LocalDateTime.now(), List.of());

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(logRepo.findByIdWithEntries(1L)).thenReturn(Optional.of(log));
        when(logMapper.toDto(log)).thenReturn(expectedDto);

        WorkoutLogDto result = service.getById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.planNameSnap()).isEqualTo("Push Pull Legs");
        verify(logRepo).findByIdWithEntries(1L);
    }

    @Test
    void getById_notFound_throwsResourceNotFoundException() {
        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(logRepo.findByIdWithEntries(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout log not found");
    }

    @Test
    void delete_happyPath_deletesLog() {
        WorkoutLog log = WorkoutLog.builder()
                .id(1L)
                .user(owner)
                .plan(plan)
                .session(session)
                .planNameSnap("Push Pull Legs")
                .sessionNameSnap("Push Day")
                .completedDate(LocalDate.of(2026, 3, 25))
                .build();

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(logRepo.findById(1L)).thenReturn(Optional.of(log));

        service.delete(1L);

        verify(logRepo).delete(log);
    }

    @Test
    void delete_wrongUser_throwsAccessDeniedException() {
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@test.com");
        otherUser.setUsername("other");
        otherUser.setPassword("hash");

        Authentication auth = new UsernamePasswordAuthenticationToken("other@test.com", null);
        SecurityContextHolder.getContext().setAuthentication(auth);

        WorkoutLog log = WorkoutLog.builder()
                .id(1L)
                .user(owner)
                .plan(plan)
                .session(session)
                .planNameSnap("Push Pull Legs")
                .sessionNameSnap("Push Day")
                .completedDate(LocalDate.of(2026, 3, 25))
                .build();

        when(userRepo.findByEmail("other@test.com")).thenReturn(Optional.of(otherUser));
        when(logRepo.findById(1L)).thenReturn(Optional.of(log));

        assertThatThrownBy(() -> service.delete(1L))
                .isInstanceOf(AccessDeniedException.class);

        verify(logRepo, never()).delete(any());
    }

    @Test
    void list_noDateRange_callsFindByUserId() {
        Page<WorkoutLog> emptyPage = new PageImpl<>(List.of());

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(logRepo.findByUserId(eq(1L), any(Pageable.class))).thenReturn(emptyPage);

        Page<WorkoutLogSummaryDto> result = service.list(null, null, 0, 10);

        assertThat(result).isNotNull();
        verify(logRepo).findByUserId(eq(1L), any(Pageable.class));
        verify(logRepo, never()).findByUserIdAndCompletedDateBetween(any(), any(), any(), any());
    }

    @Test
    void list_withDateRange_callsFindByUserIdAndDateBetween() {
        LocalDate from = LocalDate.of(2026, 3, 1);
        LocalDate to = LocalDate.of(2026, 3, 31);
        Page<WorkoutLog> emptyPage = new PageImpl<>(List.of());

        when(userRepo.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
        when(logRepo.findByUserIdAndCompletedDateBetween(eq(1L), eq(from), eq(to), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<WorkoutLogSummaryDto> result = service.list(from, to, 0, 10);

        assertThat(result).isNotNull();
        verify(logRepo).findByUserIdAndCompletedDateBetween(eq(1L), eq(from), eq(to), any(Pageable.class));
        verify(logRepo, never()).findByUserId(any(), any());
    }
}
