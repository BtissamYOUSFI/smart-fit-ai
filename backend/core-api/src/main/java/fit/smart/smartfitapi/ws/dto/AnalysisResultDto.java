package fit.smart.smartfitapi.ws.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class AnalysisResultDto {

    private Long id;
    private Double globalScore;
    private String exerciseName;
    private Integer framesAnalyzed;
    private List<AnalysisErrorDto> errors;
    private List<String> feedback;
    private LocalDateTime analyzedAt;
    private Long exerciseRepId;
}
