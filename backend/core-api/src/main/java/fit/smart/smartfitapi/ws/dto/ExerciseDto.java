package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.ExerciseType;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ExerciseDto {

    private Long id;

    private ExerciseType exerciseType;

    private Integer plannedReps;

    private Integer performedReps;

    private Double score;

    private Integer orderInSession;

    private AnalysisResultDto analysisResult;

    private VideoCaptureDto videoCapture;

    private Long sessionId;

}
