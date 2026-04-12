package fit.smart.smartfitapi.ws.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;

@Setter
@Getter
public class SessionTemplateDto {

    private Long id;

    private DayOfWeek dayOfWeek;

    private Integer orderInWeek;

//    private WeeklyTemplateDto weeklyTemplate;

//    private List<ExerciseTemplate> exerciseTemplates = new ArrayList<>();


}
