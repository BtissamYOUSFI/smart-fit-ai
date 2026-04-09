package fit.smart.smartfitapi.entity;

import fit.smart.smartfitapi.util.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercise_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseType exerciseType;

    @Column(nullable = false)
    private Integer plannedReps;

    @Column(nullable = false)
    private Integer orderInSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_template_id", nullable = false)
    private SessionTemplate sessionTemplate;
}
