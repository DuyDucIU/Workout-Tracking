package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.report.PersonalRecordDto;
import com.duyduciu.workout_tracking.dto.report.ProgressDataPointDto;
import com.duyduciu.workout_tracking.dto.report.SummaryStatsDto;
import com.duyduciu.workout_tracking.entity.User;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.repository.WorkoutLogEntryRepository;
import com.duyduciu.workout_tracking.repository.WorkoutLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock WorkoutLogRepository logRepo;
    @Mock WorkoutLogEntryRepository entryRepo;
    @Mock UserRepository userRepo;

    @InjectMocks ReportService service;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");
        user.setUsername("user");
        user.setPassword("hash");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("user@test.com", null));
    }

    // -----------------------------------------------------------------------
    // getSummaryStats
    // -----------------------------------------------------------------------

    @Test
    void getSummaryStats_noLogs_returnsZeros() {
        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(logRepo.countByUserId(1L)).thenReturn(0L);
        when(entryRepo.findTotalVolumeByUserId(1L)).thenReturn(BigDecimal.ZERO);
        when(logRepo.findAllCompletedDatesByUserId(1L)).thenReturn(List.of());

        SummaryStatsDto result = service.getSummaryStats();

        assertThat(result.totalWorkouts()).isEqualTo(0L);
        assertThat(result.totalVolumeKg()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.currentStreak()).isEqualTo(0);
        assertThat(result.longestStreak()).isEqualTo(0);
    }

    @Test
    void getSummaryStats_withLogs_returnsTotalWorkoutsAndVolume() {
        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(logRepo.countByUserId(1L)).thenReturn(5L);
        when(entryRepo.findTotalVolumeByUserId(1L)).thenReturn(new BigDecimal("1500.00"));
        when(logRepo.findAllCompletedDatesByUserId(1L)).thenReturn(List.of());

        SummaryStatsDto result = service.getSummaryStats();

        assertThat(result.totalWorkouts()).isEqualTo(5L);
        assertThat(result.totalVolumeKg()).isEqualByComparingTo(new BigDecimal("1500.00"));
    }

    @Test
    void getSummaryStats_consecutiveStreak_calculatesCorrectCurrentStreak() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate twoDaysAgo = today.minusDays(2);

        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(logRepo.countByUserId(1L)).thenReturn(3L);
        when(entryRepo.findTotalVolumeByUserId(1L)).thenReturn(BigDecimal.ZERO);
        // DESC order as the query returns
        when(logRepo.findAllCompletedDatesByUserId(1L))
                .thenReturn(List.of(today, yesterday, twoDaysAgo));

        SummaryStatsDto result = service.getSummaryStats();

        assertThat(result.currentStreak()).isEqualTo(3);
        assertThat(result.longestStreak()).isEqualTo(3);
    }

    @Test
    void getSummaryStats_brokenStreak_currentStreakZero() {
        LocalDate fiveDaysAgo = LocalDate.now().minusDays(5);
        LocalDate sixDaysAgo = LocalDate.now().minusDays(6);

        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(logRepo.countByUserId(1L)).thenReturn(2L);
        when(entryRepo.findTotalVolumeByUserId(1L)).thenReturn(BigDecimal.ZERO);
        when(logRepo.findAllCompletedDatesByUserId(1L))
                .thenReturn(List.of(fiveDaysAgo, sixDaysAgo));

        SummaryStatsDto result = service.getSummaryStats();

        assertThat(result.currentStreak()).isEqualTo(0);
        assertThat(result.longestStreak()).isEqualTo(2);
    }

    @Test
    void getSummaryStats_lastWorkoutYesterday_currentStreakStillActive() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDate twoDaysAgo = LocalDate.now().minusDays(2);

        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(logRepo.countByUserId(1L)).thenReturn(2L);
        when(entryRepo.findTotalVolumeByUserId(1L)).thenReturn(BigDecimal.ZERO);
        when(logRepo.findAllCompletedDatesByUserId(1L))
                .thenReturn(List.of(yesterday, twoDaysAgo));

        SummaryStatsDto result = service.getSummaryStats();

        assertThat(result.currentStreak()).isEqualTo(2);
        assertThat(result.longestStreak()).isEqualTo(2);
    }

    // -----------------------------------------------------------------------
    // getProgressData
    // -----------------------------------------------------------------------

    @Test
    void getProgressData_returnsEmptyWhenNoData() {
        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(entryRepo.findProgressData(1L, 5L,
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 3, 31)))
                .thenReturn(List.of());

        List<ProgressDataPointDto> result = service.getProgressData(
                5L, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 3, 31));

        assertThat(result).isEmpty();
    }

    @Test
    void getProgressData_withRows_mapsCorrectly() {
        LocalDate date = LocalDate.of(2026, 3, 1);
        Object[] row = new Object[]{date, new BigDecimal("100.00"), new BigDecimal("3000.00"), 30L};
        List<Object[]> rows = new ArrayList<>(); rows.add(row);

        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(entryRepo.findProgressData(1L, 5L,
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 3, 31)))
                .thenReturn(rows);

        List<ProgressDataPointDto> result = service.getProgressData(
                5L, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 3, 31));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).date()).isEqualTo(date);
        assertThat(result.get(0).maxWeightKg()).isEqualByComparingTo(new BigDecimal("100.00"));
        assertThat(result.get(0).totalVolumeKg()).isEqualByComparingTo(new BigDecimal("3000.00"));
        assertThat(result.get(0).totalReps()).isEqualTo(30);
    }

    @Test
    void getProgressData_nullVolumeAndReps_defaultsToZero() {
        LocalDate date = LocalDate.of(2026, 3, 1);
        Object[] row = new Object[]{date, new BigDecimal("80.00"), null, null};
        List<Object[]> rows = new ArrayList<>(); rows.add(row);

        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(entryRepo.findProgressData(1L, 5L,
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 3, 31)))
                .thenReturn(rows);

        List<ProgressDataPointDto> result = service.getProgressData(
                5L, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 3, 31));

        assertThat(result.get(0).totalVolumeKg()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.get(0).totalReps()).isEqualTo(0);
    }

    // -----------------------------------------------------------------------
    // getPersonalRecords
    // -----------------------------------------------------------------------

    @Test
    void getPersonalRecords_returnsEmptyWhenNoData() {
        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(entryRepo.findPersonalRecords(1L)).thenReturn(List.of());

        List<PersonalRecordDto> result = service.getPersonalRecords();

        assertThat(result).isEmpty();
    }

    @Test
    void getPersonalRecords_withRows_mapsCorrectly() {
        Date sqlDate = Date.valueOf(LocalDate.of(2026, 1, 15));
        Object[] row = new Object[]{5L, "Bench Press", new BigDecimal("120.00"), sqlDate};
        List<Object[]> rows = new ArrayList<>(); rows.add(row);

        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(entryRepo.findPersonalRecords(1L)).thenReturn(rows);

        List<PersonalRecordDto> result = service.getPersonalRecords();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).exerciseId()).isEqualTo(5L);
        assertThat(result.get(0).exerciseName()).isEqualTo("Bench Press");
        assertThat(result.get(0).maxWeightKg()).isEqualByComparingTo(new BigDecimal("120.00"));
        assertThat(result.get(0).achievedDate()).isEqualTo(LocalDate.of(2026, 1, 15));
    }
}
