package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.AnalysisResult;
import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.ws.dto.AnalysisResultDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AnalysisResultConverter {

    public AnalysisResultDto toDto(AnalysisResult entity) {
        if (entity == null) {
            return null;
        }
        AnalysisResultDto dto = new AnalysisResultDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getAvgKneeAngle() != null) {
            dto.setAvgKneeAngle(entity.getAvgKneeAngle());
        }
        if (entity.getAvgHipAngle() != null) {
            dto.setAvgHipAngle(entity.getAvgHipAngle());
        }
        if (entity.getAvgBackAngle() != null) {
            dto.setAvgBackAngle(entity.getAvgBackAngle());
        }
        if (entity.getStabilityScore() != null) {
            dto.setStabilityScore(entity.getStabilityScore());
        }
        if (entity.getAmplitudeScore() != null) {
            dto.setAmplitudeScore(entity.getAmplitudeScore());
        }
        if (entity.getDetectedErrors() != null && !entity.getDetectedErrors().isEmpty()) {
            dto.setDetectedErrors(new ArrayList<>(entity.getDetectedErrors()));
        }
        if (entity.getFeedback() != null) {
            dto.setFeedback(entity.getFeedback());
        }
        if (entity.getAnalyzedAt() != null) {
            dto.setAnalyzedAt(entity.getAnalyzedAt());
        }
        dto.setGlobalScore(entity.getGlobalScore());
        if (entity.getExercise() != null && entity.getExercise().getId() != null) {
            dto.setExerciseId(entity.getExercise().getId());
        }
        return dto;
    }

    public AnalysisResult toEntity(AnalysisResultDto dto) {
        if (dto == null) {
            return null;
        }
        AnalysisResult entity = new AnalysisResult();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getAvgKneeAngle() != null) {
            entity.setAvgKneeAngle(dto.getAvgKneeAngle());
        }
        if (dto.getAvgHipAngle() != null) {
            entity.setAvgHipAngle(dto.getAvgHipAngle());
        }
        if (dto.getAvgBackAngle() != null) {
            entity.setAvgBackAngle(dto.getAvgBackAngle());
        }
        if (dto.getStabilityScore() != null) {
            entity.setStabilityScore(dto.getStabilityScore());
        }
        if (dto.getAmplitudeScore() != null) {
            entity.setAmplitudeScore(dto.getAmplitudeScore());
        }
        if (dto.getDetectedErrors() != null && !dto.getDetectedErrors().isEmpty()) {
            entity.setDetectedErrors(new ArrayList<>(dto.getDetectedErrors()));
        }
        if (dto.getFeedback() != null) {
            entity.setFeedback(dto.getFeedback());
        }
        if (dto.getAnalyzedAt() != null) {
            entity.setAnalyzedAt(dto.getAnalyzedAt());
        }
        if (dto.getExerciseId() != null) {
            Exercise exercise = new Exercise();
            exercise.setId(dto.getExerciseId());
            entity.setExercise(exercise);
        }
        return entity;
    }

    public List<AnalysisResultDto> toDtos(List<AnalysisResult> entities) {
        if (entities == null) {
            return null;
        }
        List<AnalysisResultDto> dtos = new ArrayList<>();
        for (AnalysisResult entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<AnalysisResult> toEntities(List<AnalysisResultDto> dtos) {
        if (dtos == null) {
            return null;
        }
        List<AnalysisResult> entities = new ArrayList<>();
        for (AnalysisResultDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

}

