package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.ExerciseType;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ExerciseTemplateDto {

    private Long id;

    private ExerciseType exerciseType;

    private Integer plannedReps;

    private Integer orderInSession;

//    private SessionTemplateDto sessionTemplate;

}
