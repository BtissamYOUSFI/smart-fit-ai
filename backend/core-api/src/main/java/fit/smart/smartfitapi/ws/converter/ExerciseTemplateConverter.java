package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.ExerciseTemplate;
import fit.smart.smartfitapi.entity.SessionTemplate;
import fit.smart.smartfitapi.repository.SessionTemplateRepository;
import fit.smart.smartfitapi.ws.dto.ExerciseTemplateDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class ExerciseTemplateConverter {

    private final SessionTemplateRepository sessionTemplateRepository;

    public ExerciseTemplateDto toDto(ExerciseTemplate entity) {
        if (entity == null) return null;
        ExerciseTemplateDto dto = new ExerciseTemplateDto();
        dto.setId(entity.getId());
        dto.setExerciseType(entity.getExerciseType());
        dto.setSets(entity.getSets());
        dto.setRepsPerSet(entity.getRepsPerSet());
        dto.setOrderInSession(entity.getOrderInSession());
        if (entity.getSessionTemplate() != null) {
            dto.setSessionTemplateId(entity.getSessionTemplate().getId());
        }
        return dto;
    }

    public ExerciseTemplate toEntity(ExerciseTemplateDto dto) {
        if (dto == null) return null;
        ExerciseTemplate entity = new ExerciseTemplate();
        entity.setId(dto.getId());
        entity.setExerciseType(dto.getExerciseType());
        entity.setSets(dto.getSets());
        entity.setRepsPerSet(dto.getRepsPerSet());
        entity.setOrderInSession(dto.getOrderInSession());
        if (dto.getSessionTemplateId() != null) {
            sessionTemplateRepository.findById(dto.getSessionTemplateId())
                    .ifPresent(entity::setSessionTemplate);
        }
        return entity;
    }

    public List<ExerciseTemplateDto> toDtos(List<ExerciseTemplate> entities) {
        if (entities == null) return null;
        List<ExerciseTemplateDto> dtos = new ArrayList<>();
        for (ExerciseTemplate e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<ExerciseTemplate> toEntities(List<ExerciseTemplateDto> dtos) {
        if (dtos == null) return null;
        List<ExerciseTemplate> entities = new ArrayList<>();
        for (ExerciseTemplateDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }
}
