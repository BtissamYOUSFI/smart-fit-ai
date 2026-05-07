package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.ws.dto.ProgramWeekDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class ProgramWeekConverter {

    private final SessionConverter sessionConverter;

    public ProgramWeekDto toDto(ProgramWeek entity) {
        if (entity == null) return null;
        ProgramWeekDto dto = new ProgramWeekDto();
        dto.setId(entity.getId());
        dto.setWeekNumber(entity.getWeekNumber());
        dto.setStartDate(entity.getStartDate());
        dto.setIsCustomized(entity.getIsCustomized());
        if (entity.getSessions() != null && !entity.getSessions().isEmpty()) {
            dto.setSessions(sessionConverter.toDtos(entity.getSessions()));
        }
        return dto;
    }

    public ProgramWeek toEntity(ProgramWeekDto dto) {
        if (dto == null) return null;
        ProgramWeek entity = new ProgramWeek();
        entity.setId(dto.getId());
        entity.setWeekNumber(dto.getWeekNumber());
        entity.setStartDate(dto.getStartDate());
        if (dto.getIsCustomized() != null) entity.setCustomized(dto.getIsCustomized());
        if (dto.getSessions() != null && !dto.getSessions().isEmpty()) {
            entity.setSessions(sessionConverter.toEntities(dto.getSessions()));
        }
        return entity;
    }

    public List<ProgramWeekDto> toDtos(List<ProgramWeek> entities) {
        if (entities == null) return null;
        List<ProgramWeekDto> dtos = new ArrayList<>();
        for (ProgramWeek e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<ProgramWeek> toEntities(List<ProgramWeekDto> dtos) {
        if (dtos == null) return null;
        List<ProgramWeek> entities = new ArrayList<>();
        for (ProgramWeekDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }
}
