package fit.smart.smartfitapi.ws.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class SessionTemplateDto {

    private Long id;

    private DayOfWeek dayOfWeek;

    private Integer orderInWeek;

    private Long weeklyTemplate;

    private List<ExerciseTemplateDto> exerciseTemplates = new ArrayList<>();


}
