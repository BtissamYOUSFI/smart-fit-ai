package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.ws.dto.ProgramWeekDto;
import org.springframework.stereotype.Component;

@Component
public class ProgramWeekConverter {

    public ProgramWeekDto toDto(ProgramWeek entity) {
        if (entity == null) {
            return null;
        }
        ProgramWeekDto dto = new ProgramWeekDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getWeekNumber() != null) {
            dto.setWeekNumber(entity.getWeekNumber());
        }
        if (entity.getStartDate() != null) {
            dto.setStartDate(entity.getStartDate());
        }
        if (entity.getIsCustomized() != null) {
            dto.setIsCustomized(entity.getIsCustomized());
        }
        return dto;
    }
}
