package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.entity.ExerciseRep;
import fit.smart.smartfitapi.ws.dto.ExerciseRepDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class ExerciseRepConverter {

    private final VideoCaptureConverter videoCaptureConverter;
    private final AnalysisResultConverter analysisResultConverter;

    public ExerciseRepDto toDto(ExerciseRep entity) {
        if (entity == null) return null;
        ExerciseRepDto dto = new ExerciseRepDto();
        dto.setId(entity.getId());
        dto.setRepNumber(entity.getRepNumber());
        if (entity.getExercise() != null) {
            dto.setExerciseId(entity.getExercise().getId());
        }
        dto.setVideoCapture(videoCaptureConverter.toDto(entity.getVideoCapture()));
        dto.setAnalysisResult(analysisResultConverter.toDto(entity.getAnalysisResult()));
        return dto;
    }

    public ExerciseRep toEntity(ExerciseRepDto dto) {
        if (dto == null) return null;
        ExerciseRep entity = new ExerciseRep();
        entity.setId(dto.getId());
        entity.setRepNumber(dto.getRepNumber());
        if (dto.getExerciseId() != null) {
            Exercise exercise = new Exercise();
            exercise.setId(dto.getExerciseId());
            entity.setExercise(exercise);
        }
        return entity;
    }

    public List<ExerciseRepDto> toDtos(List<ExerciseRep> entities) {
        if (entities == null) return null;
        List<ExerciseRepDto> dtos = new ArrayList<>();
        for (ExerciseRep e : entities) dtos.add(toDto(e));
        return dtos;
    }
}
