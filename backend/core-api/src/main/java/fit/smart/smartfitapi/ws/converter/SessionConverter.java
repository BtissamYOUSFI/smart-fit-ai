package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.Session;
import fit.smart.smartfitapi.ws.dto.SessionDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SessionConverter {

    public SessionDto toDto(Session entity) {
        if (entity == null) {
            return null;
        }
        SessionDto dto = new SessionDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getDayOfWeek() != null) {
            dto.setDayOfWeek(entity.getDayOfWeek());
        }
        if (entity.getScheduledDate() != null) {
            dto.setScheduledDate(entity.getScheduledDate());
        }
        if (entity.getStatus() != null) {
            dto.setStatus(entity.getStatus());
        }
        if (entity.getGlobalScore() != null) {
            dto.setGlobalScore(entity.getGlobalScore());
        }
        if(entity.getExercises() != null && !entity.getExercises().isEmpty()){
            dto.setExercises(
                    exerciseConverter.toDtos(entity.getExercises())
            );
        }
        return dto;
    }

    public Session toEntity(SessionDto dto) {
        if (dto == null) {
            return null;
        }
        Session entity = new Session();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getDayOfWeek() != null) {
            entity.setDayOfWeek(dto.getDayOfWeek());
        }
        if (dto.getScheduledDate() != null) {
            entity.setScheduledDate(dto.getScheduledDate());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getGlobalScore() != null) {
            entity.setGlobalScore(dto.getGlobalScore());
        }
        if ( entity.getExercises() != null && !entity.getExercises().isEmpty()) {
            entity.setExercises(
                    exerciseConverter.toEntities(dto.getExercises())
            );
        }
        return entity;
    }

    public List<SessionDto> toDtos(List<Session> entities) {
        if (entities == null) {
            return null;
        }
        List<SessionDto> dtos = new ArrayList<>();
        for (Session entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<Session> toEntities(List<SessionDto> dtos) {
        if (dtos == null) {
            return null;
        }
        List<Session> entities = new ArrayList<>();
        for (SessionDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

    ExerciseConverter exerciseConverter = new ExerciseConverter();

}
