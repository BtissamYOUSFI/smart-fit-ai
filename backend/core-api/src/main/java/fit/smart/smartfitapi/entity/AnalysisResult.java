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

    private Double avgKneeAngle;
    private Double avgHipAngle;
    private Double avgBackAngle;
    private Double stabilityScore;
    private Double amplitudeScore;

    @ElementCollection
    @CollectionTable(name = "analysis_detected_errors", joinColumns = @JoinColumn(name = "analysis_result_id"))
    @Column(name = "error")
    @Builder.Default
    private List<String> detectedErrors = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime analyzedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @PrePersist
    protected void onAnalysis() {
        this.analyzedAt = LocalDateTime.now();
    }

    public Double getGlobalScore() {
        double posture = (avgKneeAngle != null && avgHipAngle != null && avgBackAngle != null)
                ? (avgKneeAngle + avgHipAngle + avgBackAngle) / 3.0
                : 0.0;
        double stability = stabilityScore != null ? stabilityScore : 0.0;
        double amplitude = amplitudeScore != null ? amplitudeScore : 0.0;
        return (posture * 0.5 + stability * 0.25 + amplitude * 0.25);
    }
}
