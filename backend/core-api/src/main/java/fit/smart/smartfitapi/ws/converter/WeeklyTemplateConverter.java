package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.WeeklyTemplate;
import fit.smart.smartfitapi.service.facade.TrainingProgramService;
import fit.smart.smartfitapi.ws.dto.WeeklyTemplateDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Component
public class WeeklyTemplateConverter {

    public WeeklyTemplateDto toDto(WeeklyTemplate entity) {
        if (entity == null) return null;
        WeeklyTemplateDto dto = new WeeklyTemplateDto();
        if (entity.getId() != null) { dto.setId(entity.getId()); }
        if (entity.getLabel() != null) { dto.setLabel(entity.getLabel()); }
        if (entity.getWeekOfMonth() != null) { dto.setWeekOfMonth(entity.getWeekOfMonth()); }
        if(entity.getRepeatMode() != null) { dto.setRepeatMode(entity.getRepeatMode()); }
        if (entity.getSessionTemplates() != null) {
            dto.setSessionTemplates(sessionTemplateConverter.toDtos(entity.getSessionTemplates()));
        }
        if (entity.getTrainingProgram() != null) {
            dto.setTrainingProgramId(entity.getTrainingProgram().getId());
        }
        return dto;
    }

    public WeeklyTemplate toEntity(WeeklyTemplateDto dto) {
        if (dto == null) return null;
        WeeklyTemplate entity = new WeeklyTemplate();
        if (dto.getId() != null) { entity.setId(dto.getId()); }
        if (dto.getLabel() != null) { entity.setLabel(dto.getLabel()); }
        if (dto.getWeekOfMonth() != null) { entity.setWeekOfMonth(dto.getWeekOfMonth()); }
        if (dto.getRepeatMode() != null) { entity.setRepeatMode(dto.getRepeatMode()); }
        if (dto.getSessionTemplates() != null) {
            entity.setSessionTemplates(sessionTemplateConverter.toEntities(dto.getSessionTemplates()));
        }
        if (dto.getTrainingProgramId() != null) {
            entity.setTrainingProgram(trainingProgramService.findById(dto.getTrainingProgramId()));
        }
        return entity;
    }

    public List<WeeklyTemplateDto> toDtos(List<WeeklyTemplate> entities) {
        if (entities == null) return null;
        List<WeeklyTemplateDto> dtos = new ArrayList<WeeklyTemplateDto>();
        for (WeeklyTemplate entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<WeeklyTemplate> toEntities(List<WeeklyTemplateDto> dtos) {
        if (dtos == null) return null;
        List<WeeklyTemplate> entities = new ArrayList<>();
        for (WeeklyTemplateDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

     private final SessionTemplateConverter sessionTemplateConverter;
     private final TrainingProgramService trainingProgramService;
}
