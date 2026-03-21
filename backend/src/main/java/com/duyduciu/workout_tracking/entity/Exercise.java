package com.duyduciu.workout_tracking.entity;

import com.duyduciu.workout_tracking.enums.ExerciseCategory;
import com.duyduciu.workout_tracking.enums.MuscleGroup;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercises")
@Getter @Setter @NoArgsConstructor
public class Exercise {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @Enumerated(EnumType.STRING)
    private ExerciseCategory category;
    @Enumerated(EnumType.STRING)
    @Column(name = "muscle_group")
    private MuscleGroup muscleGroup;
    @Column(name = "is_system")
    private boolean isSystem;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
