package fit.smart.smartfitapi.ws.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
public class ProgramWeekDto {

    private Long id;

    private Integer weekNumber;

    private LocalDate startDate;

    private Boolean isCustomized;

    private TrainingProgramDto trainingProgram;

    private WeeklyTemplateDto weeklyTemplate;

    private List<SessionDto> sessions;

}
