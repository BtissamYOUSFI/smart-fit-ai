package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.ExerciseRep;
import fit.smart.smartfitapi.entity.VideoCapture;
import fit.smart.smartfitapi.ws.dto.VideoCaptureDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class VideoCaptureConverter {

    public VideoCaptureDto toDto(VideoCapture entity) {
        if (entity == null) return null;
        VideoCaptureDto dto = new VideoCaptureDto();
        dto.setId(entity.getId());
        dto.setSourceMode(entity.getSourceMode());
        dto.setFilePath(entity.getFilePath());
        dto.setDurationSeconds(entity.getDurationSeconds());
        dto.setUploadedAt(entity.getUploadedAt());
        if (entity.getExerciseRep() != null) {
            dto.setExerciseRepId(entity.getExerciseRep().getId());
        }
        return dto;
    }

    public VideoCapture toEntity(VideoCaptureDto dto) {
        if (dto == null) return null;
        VideoCapture entity = new VideoCapture();
        entity.setId(dto.getId());
        entity.setSourceMode(dto.getSourceMode());
        entity.setFilePath(dto.getFilePath());
        entity.setDurationSeconds(dto.getDurationSeconds());
        entity.setUploadedAt(dto.getUploadedAt());
        if (dto.getExerciseRepId() != null) {
            ExerciseRep rep = new ExerciseRep();
            rep.setId(dto.getExerciseRepId());
            entity.setExerciseRep(rep);
        }
        return entity;
    }

    public List<VideoCaptureDto> toDtos(List<VideoCapture> entities) {
        if (entities == null) return null;
        List<VideoCaptureDto> dtos = new ArrayList<>();
        for (VideoCapture e : entities) dtos.add(toDto(e));
        return dtos;
    }

    public List<VideoCapture> toEntities(List<VideoCaptureDto> dtos) {
        if (dtos == null) return null;
        List<VideoCapture> entities = new ArrayList<>();
        for (VideoCaptureDto dto : dtos) entities.add(toEntity(dto));
        return entities;
    }
}
