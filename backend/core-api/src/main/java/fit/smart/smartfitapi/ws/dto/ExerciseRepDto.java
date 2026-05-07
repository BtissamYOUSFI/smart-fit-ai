package fit.smart.smartfitapi.ws.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseRepDto {

    private Long id;
    private Integer repNumber;
    private Long exerciseId;
    private VideoCaptureDto videoCapture;
    private AnalysisResultDto analysisResult;
}
