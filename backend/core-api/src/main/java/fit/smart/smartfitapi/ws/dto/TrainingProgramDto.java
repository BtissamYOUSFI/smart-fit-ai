package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.entity.WeeklyTemplate;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TrainingProgramDto {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String userEmail;
    private List<WeeklyTemplateDto> weeklyTemplates ;
    private List<ProgramWeekDto> programWeeks ;

}
