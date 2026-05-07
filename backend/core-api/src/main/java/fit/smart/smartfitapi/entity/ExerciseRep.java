package fit.smart.smartfitapi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercise_reps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseRep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer repNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @OneToOne(mappedBy = "exerciseRep", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private VideoCapture videoCapture;

    @OneToOne(mappedBy = "exerciseRep", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private AnalysisResult analysisResult;

    public boolean isAnalyzed() {
        return analysisResult != null;
    }
}
