package com.duyduciu.workout_tracking.entity;

import com.duyduciu.workout_tracking.enums.WorkoutDayOfWeek;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_sessions")
@Getter @Setter @Builder @AllArgsConstructor
public class WorkoutSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private WorkoutPlan plan;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private WorkoutDayOfWeek dayOfWeek;

    @Column(name = "order_index")
    private Integer orderIndex;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SessionExercise> exercises = new ArrayList<>();

    public WorkoutSession() {
        this.exercises = new ArrayList<>();
    }
}
