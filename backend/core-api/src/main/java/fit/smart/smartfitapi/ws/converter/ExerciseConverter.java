package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.ws.dto.ExerciseDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class ExerciseConverter {

    private final ExerciseRepConverter exerciseRepConverter;

    public ExerciseDto toDto(Exercise entity) {
        if (entity == null) return null;
        ExerciseDto dto = new ExerciseDto();
        dto.setId(entity.getId());
        dto.setExerciseType(entity.getExerciseType());
        dto.setPlannedSets(entity.getPlannedSets());
        dto.setPlannedRepsPerSet(entity.getPlannedRepsPerSet());
        dto.setScore(entity.getScore());
        dto.setOrderInSession(entity.getOrderInSession());
        if (entity.getSession() != null) {
            dto.setSessionId(entity.getSession().getId());
        }
        if (entity.getReps() != null) {
            dto.setReps(exerciseRepConverter.toDtos(entity.getReps()));
        }
        return dto;
    }

    public Exercise toEntity(ExerciseDto dto) {
        if (dto == null) return null;
        Exercise entity = new Exercise();
        entity.setId(dto.getId());
        entity.setExerciseType(dto.getExerciseType());
        entity.setPlannedSets(dto.getPlannedSets());
        entity.setPlannedRepsPerSet(dto.getPlannedRepsPerSet());
        entity.setScore(dto.getScore());
        entity.setOrderInSession(dto.getOrderInSession());
        return entity;
    }

    public List<ExerciseDto> toDtos(List<Exercise> entities) {
        if (entities == null) return null;
        List<ExerciseDto> dtos = new ArrayList<>();
        for (Exercise e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<Exercise> toEntities(List<ExerciseDto> dtos) {
        if (dtos == null) return null;
        List<Exercise> entities = new ArrayList<>();
        for (ExerciseDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }
}
