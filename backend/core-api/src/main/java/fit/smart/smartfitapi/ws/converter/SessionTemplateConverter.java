package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.SessionTemplate;
import fit.smart.smartfitapi.repository.WeeklyTemplateRepository;
import fit.smart.smartfitapi.ws.dto.SessionTemplateDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class SessionTemplateConverter {

    private final WeeklyTemplateRepository weeklyTemplateRepository;
    private final ExerciseTemplateConverter exerciseTemplateConverter;

    public SessionTemplateDto toDto(SessionTemplate entity) {
        if (entity == null) return null;
        SessionTemplateDto dto = new SessionTemplateDto();
        dto.setId(entity.getId());
        dto.setDayOfWeek(entity.getDayOfWeek());
        dto.setOrderInWeek(entity.getOrderInWeek());
        if (entity.getWeeklyTemplate() != null) {
            dto.setWeeklyTemplateId(entity.getWeeklyTemplate().getId());
        }
        if (entity.getExerciseTemplates() != null && !entity.getExerciseTemplates().isEmpty()) {
            dto.setExerciseTemplates(exerciseTemplateConverter.toDtos(entity.getExerciseTemplates()));
        }
        return dto;
    }

    public SessionTemplate toEntity(SessionTemplateDto dto) {
        if (dto == null) return null;
        SessionTemplate entity = new SessionTemplate();
        entity.setId(dto.getId());
        entity.setDayOfWeek(dto.getDayOfWeek());
        entity.setOrderInWeek(dto.getOrderInWeek());
        if (dto.getWeeklyTemplateId() != null) {
            weeklyTemplateRepository.findById(dto.getWeeklyTemplateId())
                    .ifPresent(entity::setWeeklyTemplate);
        }
        if (dto.getExerciseTemplates() != null && !dto.getExerciseTemplates().isEmpty()) {
            entity.setExerciseTemplates(exerciseTemplateConverter.toEntities(dto.getExerciseTemplates()));
        }
        return entity;
    }

    public List<SessionTemplateDto> toDtos(List<SessionTemplate> entities) {
        if (entities == null) return null;
        List<SessionTemplateDto> dtos = new ArrayList<>();
        for (SessionTemplate e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<SessionTemplate> toEntities(List<SessionTemplateDto> dtos) {
        if (dtos == null) return null;
        List<SessionTemplate> entities = new ArrayList<>();
        for (SessionTemplateDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }
}
