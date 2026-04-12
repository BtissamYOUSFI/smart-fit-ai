package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.ws.dto.ProgramWeekDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
        if(entity.getSessions()!=null && !entity.getSessions().isEmpty()){
            dto.setSessions(
                    sessionConverter.toDtos(entity.getSessions())
            );
        }
        return dto;
    }

    public ProgramWeek toEntity(ProgramWeekDto dto) {
        if (dto == null) {
            return null;
        }
        ProgramWeek entity = new ProgramWeek();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getWeekNumber() != null) {
            entity.setWeekNumber(dto.getWeekNumber());
        }
        if (dto.getStartDate() != null) {
            entity.setStartDate(dto.getStartDate());
        }
        if (dto.getIsCustomized() != null) {
            entity.setCustomized(dto.getIsCustomized());
        }
        if(dto.getSessions()!=null && !dto.getSessions().isEmpty()){
            entity.setSessions(
                    sessionConverter.toEntities(dto.getSessions())
            );
        }
        return entity;
    }

    public List<ProgramWeekDto> toDtos(List<ProgramWeek> entities) {
        if (entities == null) {
            return null;
        }
        List<ProgramWeekDto> dtos = new ArrayList<>();
        for (ProgramWeek entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<ProgramWeek> toEntities(List<ProgramWeekDto> dtos) {
        if (dtos == null) {
            return null;
        }
        List<ProgramWeek> entities = new ArrayList<>();
        for (ProgramWeekDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

    SessionConverter sessionConverter = new SessionConverter();

}
