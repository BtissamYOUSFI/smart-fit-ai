package fit.smart.smartfitapi.entity;

import fit.smart.smartfitapi.util.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseType exerciseType;

    @Column(nullable = false)
    private Integer plannedReps;

    private Integer performedReps;

    private Double score;

    @Column(nullable = false)
    private Integer orderInSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @OneToOne(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private VideoCapture videoCapture;

    @OneToOne(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private AnalysisResult analysisResult;

    public boolean isAnalyzed() {
        return analysisResult != null;
    }
}
