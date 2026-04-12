package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.RepeatMode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WeeklyTemplateDto {
    private Long id;
    private String label;
    private RepeatMode repeatMode;
    private Integer weekOfMonth;
    private Long trainingProgramId;
    private List<SessionTemplateDto> sessionTemplates;
}
