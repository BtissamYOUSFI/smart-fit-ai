package fit.smart.smartfitapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisError {

    @Column(name = "joint")
    private String joint;

    @Column(name = "occurrences")
    private Integer occurrences;

    @Column(name = "avg_angle")
    private Double avgAngle;

    @Column(name = "worst_angle")
    private Double worstAngle;

    @Column(name = "range_min")
    private Integer rangeMin;

    @Column(name = "range_max")
    private Integer rangeMax;

    @Column(name = "message", length = 512)
    private String message;
}
