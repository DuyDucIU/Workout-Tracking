package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.report.*;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.repository.WorkoutLogEntryRepository;
import com.duyduciu.workout_tracking.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final WorkoutLogRepository logRepo;
    private final WorkoutLogEntryRepository entryRepo;
    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    public List<ProgressDataPointDto> getProgressData(Long exerciseId, LocalDate from, LocalDate to) {
        Long userId = getCurrentUserId();
        List<Object[]> rows = entryRepo.findProgressData(userId, exerciseId, from, to);
        List<ProgressDataPointDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            LocalDate date = (LocalDate) row[0];
            BigDecimal maxWeight = (BigDecimal) row[1];
            BigDecimal totalVolume = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;
            Long totalReps = row[3] != null ? ((Number) row[3]).longValue() : 0L;
            result.add(new ProgressDataPointDto(date, maxWeight, totalVolume, totalReps.intValue()));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public SummaryStatsDto getSummaryStats() {
        Long userId = getCurrentUserId();
        long totalWorkouts = logRepo.countByUserId(userId);
        BigDecimal totalVolume = entryRepo.findTotalVolumeByUserId(userId);
        if (totalVolume == null) totalVolume = BigDecimal.ZERO;
        List<LocalDate> dates = logRepo.findAllCompletedDatesByUserId(userId);
        int[] streaks = calculateStreaks(dates);
        return new SummaryStatsDto(totalWorkouts, totalVolume, streaks[0], streaks[1]);
    }

    @Transactional(readOnly = true)
    public List<PersonalRecordDto> getPersonalRecords() {
        Long userId = getCurrentUserId();
        List<Object[]> rows = entryRepo.findPersonalRecords(userId);
        List<PersonalRecordDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            Long exerciseId = ((Number) row[0]).longValue();
            String exerciseName = (String) row[1];
            BigDecimal maxWeight = (BigDecimal) row[2];
            LocalDate achievedDate = toLocalDate(row[3]);
            result.add(new PersonalRecordDto(exerciseId, exerciseName, maxWeight, achievedDate));
        }
        return result;
    }

    /** Returns [currentStreak, longestStreak] in days. dates must be DESC order. */
    private int[] calculateStreaks(List<LocalDate> dates) {
        if (dates.isEmpty()) return new int[]{0, 0};

        LocalDate today = LocalDate.now();
        int current = 0;
        int longest = 0;
        int running = 0;
        LocalDate prev = null;

        for (LocalDate date : dates) {
            if (prev == null) {
                // start: only count if today or yesterday
                if (!date.isAfter(today) && !date.isBefore(today.minusDays(1))) {
                    running = 1;
                    current = 1;
                } else {
                    running = 1;
                    current = 0;
                }
            } else {
                if (prev.minusDays(1).equals(date)) {
                    running++;
                    if (current > 0) current++;
                } else {
                    longest = Math.max(longest, running);
                    running = 1;
                    current = 0;
                }
            }
            prev = date;
        }
        longest = Math.max(longest, running);
        return new int[]{current, longest};
    }

    private static LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate ld) return ld;
        if (value instanceof java.sql.Date d) return d.toLocalDate();
        return LocalDate.parse(value.toString());
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }
}
