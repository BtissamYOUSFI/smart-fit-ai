package fit.smart.smartfitapi.ws.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class AnalysisResultDto {

    private Long id;

    private Double avgKneeAngle;

    private Double avgHipAngle;

    private Double avgBackAngle;

    private Double stabilityScore;

    private Double amplitudeScore;

    private List<String> detectedErrors;

    private String feedback;

    private LocalDateTime analyzedAt;

    private Double globalScore;

    private Long exerciseId;

}

