package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.SessionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
public class SessionDto {

    private Long id;

    private DayOfWeek dayOfWeek;

    private LocalDate scheduledDate;

    private SessionStatus status;

    private Double globalScore;

    private Long programWeekId;

    private List<ExerciseDto> exercises;

}
