package fit.smart.smartfitapi.ws.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AnalysisErrorDto {

    private String joint;
    private Integer occurrences;
    private Double avgAngle;
    private Double worstAngle;
    private List<Integer> range;
    private String message;
}
