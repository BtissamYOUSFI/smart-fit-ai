package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.entity.TrainingProgram;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String passwordHash;
    private LocalDateTime createdAt;
    private List<TrainingProgramDto> programs ;
}
