package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.AnalysisError;
import fit.smart.smartfitapi.entity.AnalysisResult;
import fit.smart.smartfitapi.entity.ExerciseRep;
import fit.smart.smartfitapi.ws.dto.AnalysisErrorDto;
import fit.smart.smartfitapi.ws.dto.AnalysisResultDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AnalysisResultConverter {

    public AnalysisResultDto toDto(AnalysisResult entity) {
        if (entity == null) return null;
        AnalysisResultDto dto = new AnalysisResultDto();
        dto.setId(entity.getId());
        dto.setGlobalScore(entity.getGlobalScore());
        dto.setExerciseName(entity.getExerciseName());
        dto.setFramesAnalyzed(entity.getFramesAnalyzed());
        dto.setAnalyzedAt(entity.getAnalyzedAt());
        if (entity.getExerciseRep() != null) {
            dto.setExerciseRepId(entity.getExerciseRep().getId());
        }
        if (entity.getErrors() != null) {
            List<AnalysisErrorDto> errorDtos = new ArrayList<>();
            for (AnalysisError e : entity.getErrors()) {
                AnalysisErrorDto ed = new AnalysisErrorDto();
                ed.setJoint(e.getJoint());
                ed.setOccurrences(e.getOccurrences());
                ed.setAvgAngle(e.getAvgAngle());
                ed.setWorstAngle(e.getWorstAngle());
                ed.setRange(e.getRangeMin() != null && e.getRangeMax() != null
                        ? List.of(e.getRangeMin(), e.getRangeMax()) : List.of());
                ed.setMessage(e.getMessage());
                errorDtos.add(ed);
            }
            dto.setErrors(errorDtos);
        }
        if (entity.getFeedback() != null) {
            dto.setFeedback(new ArrayList<>(entity.getFeedback()));
        }
        return dto;
    }

    public List<AnalysisResultDto> toDtos(List<AnalysisResult> entities) {
        if (entities == null) return null;
        List<AnalysisResultDto> dtos = new ArrayList<>();
        for (AnalysisResult e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<AnalysisResult> toEntities(List<AnalysisResultDto> dtos) {
        if (dtos == null) return null;
        List<AnalysisResult> entities = new ArrayList<>();
        for (AnalysisResultDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }

    public AnalysisResult toEntity(AnalysisResultDto dto) {
        if (dto == null) return null;
        AnalysisResult entity = new AnalysisResult();
        entity.setId(dto.getId());
        entity.setGlobalScore(dto.getGlobalScore());
        entity.setExerciseName(dto.getExerciseName());
        entity.setFramesAnalyzed(dto.getFramesAnalyzed());
        entity.setAnalyzedAt(dto.getAnalyzedAt());
        if (dto.getExerciseRepId() != null) {
            ExerciseRep rep = new ExerciseRep();
            rep.setId(dto.getExerciseRepId());
            entity.setExerciseRep(rep);
        }
        if (dto.getErrors() != null) {
            List<AnalysisError> errors = new ArrayList<>();
            for (AnalysisErrorDto ed : dto.getErrors()) {
                AnalysisError e = new AnalysisError();
                e.setJoint(ed.getJoint());
                e.setOccurrences(ed.getOccurrences());
                e.setAvgAngle(ed.getAvgAngle());
                e.setWorstAngle(ed.getWorstAngle());
                if (ed.getRange() != null && ed.getRange().size() >= 2) {
                    e.setRangeMin(ed.getRange().get(0));
                    e.setRangeMax(ed.getRange().get(1));
                }
                e.setMessage(ed.getMessage());
                errors.add(e);
            }
            entity.setErrors(errors);
        }
        if (dto.getFeedback() != null) {
            entity.setFeedback(new ArrayList<>(dto.getFeedback()));
        }
        return entity;
    }
}
