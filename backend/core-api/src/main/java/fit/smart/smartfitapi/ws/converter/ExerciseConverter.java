package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.ws.dto.ExerciseDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExerciseConverter {

    public ExerciseDto toDto(Exercise entity) {
        if (entity == null) {
            return null;
        }
        ExerciseDto dto = new ExerciseDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getExerciseType() != null) {
            dto.setExerciseType(entity.getExerciseType());
        }
        if (entity.getPlannedReps() != null) {
            dto.setPlannedReps(entity.getPlannedReps());
        }
        if (entity.getPerformedReps() != null) {
            dto.setPerformedReps(entity.getPerformedReps());
        }
        if (entity.getScore() != null) {
            dto.setScore(entity.getScore());
        }
        if (entity.getOrderInSession() != null) {
            dto.setOrderInSession(entity.getOrderInSession());
        }
        return dto;
    }

    public Exercise toEntity(ExerciseDto dto) {
        if (dto == null) {
            return null;
        }
        Exercise entity = new Exercise();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getExerciseType() != null) {
            entity.setExerciseType(dto.getExerciseType());
        }
        if (dto.getPlannedReps() != null) {
            entity.setPlannedReps(dto.getPlannedReps());
        }
        if (dto.getPerformedReps() != null) {
            entity.setPerformedReps(dto.getPerformedReps());
        }
        if (dto.getScore() != null) {
            entity.setScore(dto.getScore());
        }
        if (dto.getOrderInSession() != null) {
            entity.setOrderInSession(dto.getOrderInSession());
        }
        return entity;
    }

    public List<ExerciseDto> toDtos(List<Exercise> entities) {
        if (entities == null) {
            return null;
        }
        List<ExerciseDto> dtos = new ArrayList<>();
        for (Exercise entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<Exercise> toEntities(List<ExerciseDto> dtos) {
        if (dtos == null) {
            return null;
        }
        List<Exercise> entities = new ArrayList<>();
        for (ExerciseDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

}
