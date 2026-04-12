package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.entity.VideoCapture;
import fit.smart.smartfitapi.ws.dto.VideoCaptureDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class VideoCaptureConverter {

    public VideoCaptureDto toDto(VideoCapture entity) {
        if (entity == null) {
            return null;
        }
        VideoCaptureDto dto = new VideoCaptureDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getSourceMode() != null) {
            dto.setSourceMode(entity.getSourceMode());
        }
        if (entity.getFilePath() != null) {
            dto.setFilePath(entity.getFilePath());
        }
        if (entity.getDurationSeconds() != null) {
            dto.setDurationSeconds(entity.getDurationSeconds());
        }
        if (entity.getUploadedAt() != null) {
            dto.setUploadedAt(entity.getUploadedAt());
        }
        if (entity.getExercise() != null && entity.getExercise().getId() != null) {
            dto.setExerciseId(entity.getExercise().getId());
        }
        return dto;
    }

    public VideoCapture toEntity(VideoCaptureDto dto) {
        if (dto == null) {
            return null;
        }
        VideoCapture entity = new VideoCapture();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getSourceMode() != null) {
            entity.setSourceMode(dto.getSourceMode());
        }
        if (dto.getFilePath() != null) {
            entity.setFilePath(dto.getFilePath());
        }
        if (dto.getDurationSeconds() != null) {
            entity.setDurationSeconds(dto.getDurationSeconds());
        }
        if (dto.getUploadedAt() != null) {
            entity.setUploadedAt(dto.getUploadedAt());
        }
        if (dto.getExerciseId() != null) {
            Exercise exercise = new Exercise();
            exercise.setId(dto.getExerciseId());
            entity.setExercise(exercise);
        }
        return entity;
    }

    public List<VideoCaptureDto> toDtos(List<VideoCapture> entities) {
        if (entities == null) {
            return null;
        }
        List<VideoCaptureDto> dtos = new ArrayList<>();
        for (VideoCapture entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<VideoCapture> toEntities(List<VideoCaptureDto> dtos) {
        if (dtos == null) {
            return null;
        }
        List<VideoCapture> entities = new ArrayList<>();
        for (VideoCaptureDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

}

