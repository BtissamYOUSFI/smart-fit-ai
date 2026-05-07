package fit.smart.smartfitapi.entity;

import fit.smart.smartfitapi.util.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

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
    private Integer plannedSets;

    @Column(nullable = false)
    private Integer plannedRepsPerSet;

    private Double score;

    @Column(nullable = false)
    private Integer orderInSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ExerciseRep> reps = new ArrayList<>();

    public void computeScore() {
        this.score = reps.stream()
                .map(ExerciseRep::getAnalysisResult)
                .filter(ar -> ar != null && ar.getGlobalScore() != null)
                .mapToDouble(AnalysisResult::getGlobalScore)
                .average()
                .orElse(0.0);
    }

    public boolean isAnalyzed() {
        return reps.stream().anyMatch(r -> r.getAnalysisResult() != null);
    }
}
