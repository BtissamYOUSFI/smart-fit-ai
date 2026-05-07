package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.Session;
import fit.smart.smartfitapi.ws.dto.SessionDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class SessionConverter {

    private final ExerciseConverter exerciseConverter;

    public SessionDto toDto(Session entity) {
        if (entity == null) return null;
        SessionDto dto = new SessionDto();
        dto.setId(entity.getId());
        dto.setDayOfWeek(entity.getDayOfWeek());
        dto.setScheduledDate(entity.getScheduledDate());
        dto.setStatus(entity.getStatus());
        dto.setGlobalScore(entity.getGlobalScore());
        if (entity.getProgramWeek() != null) {
            dto.setProgramWeekId(entity.getProgramWeek().getId());
        }
        if (entity.getExercises() != null && !entity.getExercises().isEmpty()) {
            dto.setExercises(exerciseConverter.toDtos(entity.getExercises()));
        }
        return dto;
    }

    public Session toEntity(SessionDto dto) {
        if (dto == null) return null;
        Session entity = new Session();
        entity.setId(dto.getId());
        entity.setDayOfWeek(dto.getDayOfWeek());
        entity.setScheduledDate(dto.getScheduledDate());
        entity.setStatus(dto.getStatus());
        entity.setGlobalScore(dto.getGlobalScore());
        if (dto.getExercises() != null && !dto.getExercises().isEmpty()) {
            entity.setExercises(exerciseConverter.toEntities(dto.getExercises()));
        }
        return entity;
    }

    public List<SessionDto> toDtos(List<Session> entities) {
        if (entities == null) return null;
        List<SessionDto> dtos = new ArrayList<>();
        for (Session e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<Session> toEntities(List<SessionDto> dtos) {
        if (dtos == null) return null;
        List<Session> entities = new ArrayList<>();
        for (SessionDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }
}
