package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.entity.Session;
import fit.smart.smartfitapi.entity.TrainingProgram;
import fit.smart.smartfitapi.entity.WeeklyTemplate;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProgramWeekDto {
    private Long id;
    private Integer weekNumber;
    private LocalDate startDate;
    private Boolean isCustomized;
    private TrainingProgram trainingProgram;
    private WeeklyTemplate weeklyTemplate;
    private List<Session> sessions = new ArrayList<>();

}
