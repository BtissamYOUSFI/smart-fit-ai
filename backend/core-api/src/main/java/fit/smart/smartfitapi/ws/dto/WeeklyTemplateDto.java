package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.RepeatMode;

public class WeeklyTemplateDto {
    private Long id;
    private String label;
    private RepeatMode repeatMode;
    private Integer weekOfMonth;
    private TrainingProgramDto trainingProgram;

}
