package fit.smart.smartfitapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analysis_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double globalScore;

    @Column(name = "exercise_name")
    private String exerciseName;

    private Integer framesAnalyzed;

    @ElementCollection
    @CollectionTable(name = "analysis_errors", joinColumns = @JoinColumn(name = "analysis_result_id"))
    @Builder.Default
    private List<AnalysisError> errors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "analysis_feedback", joinColumns = @JoinColumn(name = "analysis_result_id"))
    @Column(name = "feedback_line", length = 512)
    @Builder.Default
    private List<String> feedback = new ArrayList<>();

    private LocalDateTime analyzedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_rep_id", nullable = false)
    private ExerciseRep exerciseRep;

    @PrePersist
    protected void onAnalysis() {
        this.analyzedAt = LocalDateTime.now();
    }
}
