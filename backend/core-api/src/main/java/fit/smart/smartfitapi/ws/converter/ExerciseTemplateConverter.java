package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.ExerciseTemplate;
import fit.smart.smartfitapi.ws.dto.ExerciseTemplateDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExerciseTemplateConverter {

    public ExerciseTemplateDto toDto(ExerciseTemplate entity) {
        if (entity == null) {
            return null;
        }
        ExerciseTemplateDto dto = new ExerciseTemplateDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getExerciseType() != null) {
            dto.setExerciseType(entity.getExerciseType());
        }
        if (entity.getPlannedReps() != null) {
            dto.setPlannedReps(entity.getPlannedReps());
        }
        if (entity.getOrderInSession() != null) {
            dto.setOrderInSession(entity.getOrderInSession());
        }
        return dto;
    }

    public ExerciseTemplate toEntity(ExerciseTemplateDto dto) {
        if (dto == null) {
            return null;
        }
        ExerciseTemplate entity = new ExerciseTemplate();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getExerciseType() != null) {
            entity.setExerciseType(dto.getExerciseType());
        }
        if (dto.getPlannedReps() != null) {
            entity.setPlannedReps(dto.getPlannedReps());
        }
        if (dto.getOrderInSession() != null) {
            entity.setOrderInSession(dto.getOrderInSession());
        }
        return entity;
    }

    public List<ExerciseTemplateDto> toDtos(List<ExerciseTemplate> entities) {
        if (entities == null) {
            return null;
        }
        List<ExerciseTemplateDto> dtos = new ArrayList<>();
        for (ExerciseTemplate entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<ExerciseTemplate> toEntities(List<ExerciseTemplateDto> dtos) {
        if (dtos == null) {
            return null;
        }
        List<ExerciseTemplate> entities = new ArrayList<>();
        for (ExerciseTemplateDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

}
