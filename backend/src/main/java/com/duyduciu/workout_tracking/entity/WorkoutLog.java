package com.duyduciu.workout_tracking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_logs")
@Getter @Setter @Builder @AllArgsConstructor
public class WorkoutLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private WorkoutPlan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private WorkoutSession session;

    @Column(name = "plan_name_snap")
    private String planNameSnap;

    @Column(name = "session_name_snap")
    private String sessionNameSnap;

    @Column(name = "completed_date", nullable = false)
    private LocalDate completedDate;

    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "log", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkoutLogEntry> entries = new ArrayList<>();

    public WorkoutLog() {
        this.entries = new ArrayList<>();
    }

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); }
}
