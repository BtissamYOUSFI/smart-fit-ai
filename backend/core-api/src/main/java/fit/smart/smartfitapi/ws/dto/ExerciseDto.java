package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.ExerciseType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ExerciseDto {

    private Long id;
    private ExerciseType exerciseType;
    private Integer plannedSets;
    private Integer plannedRepsPerSet;
    private Double score;
    private Integer orderInSession;
    private Long sessionId;
    private List<ExerciseRepDto> reps;
}
