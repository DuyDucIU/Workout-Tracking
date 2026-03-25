package com.duyduciu.workout_tracking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "workout_log_entries")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class WorkoutLogEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "log_id", nullable = false)
    private WorkoutLog log;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @Column(name = "exercise_name_snap", nullable = false)
    private String exerciseNameSnap;

    @Column(name = "actual_sets", nullable = false)
    private Integer actualSets;

    @Column(name = "actual_reps", nullable = false)
    private Integer actualReps;

    @Column(name = "actual_weight_kg", precision = 6, scale = 2)
    private BigDecimal actualWeightKg;

    private String notes;
}
