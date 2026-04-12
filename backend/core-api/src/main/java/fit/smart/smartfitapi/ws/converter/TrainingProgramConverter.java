package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.TrainingProgram;
import fit.smart.smartfitapi.service.facade.UserService;
import fit.smart.smartfitapi.ws.dto.TrainingProgramDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Component
public class TrainingProgramConverter {

    public TrainingProgramDto toDto(TrainingProgram entity) {
        if (entity == null) return null;
        TrainingProgramDto dto = new TrainingProgramDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getTitle() != null) {
            dto.setTitle(entity.getTitle());
        }
        if (entity.getStartDate() != null) {
            dto.setStartDate(entity.getStartDate());
        }
        if (entity.getEndDate() != null) {
            dto.setEndDate(entity.getEndDate());
        }
        if (entity.getUser() != null) {
            dto.setUserEmail(entity.getUser().getEmail());
        }
        if (entity.getProgramWeeks() != null) {
            dto.setProgramWeeks(programWeekConverter.toDtos(entity.getProgramWeeks()));
        }
        if (entity.getWeeklyTemplates() != null) {
            dto.setWeeklyTemplates(weeklyTemplateConverter.toDtos(entity.getWeeklyTemplates()));
        }
        return dto;
    }

    public TrainingProgram toEntity(TrainingProgramDto dto) {
        if (dto == null) return null;
        TrainingProgram entity = new TrainingProgram();
        if (dto.getId() != null) { entity.setId(dto.getId()); }
        if (dto.getTitle() != null) { entity.setTitle(dto.getTitle()); }
        if (dto.getStartDate() != null) { entity.setStartDate(dto.getStartDate()); }
        if (dto.getEndDate() != null) { entity.setEndDate(dto.getEndDate()); }
        if (dto.getUserEmail() != null) {
            entity.setUser(userService.findByEmail(dto.getUserEmail()));
        }
        if (dto.getProgramWeeks() != null) {
            entity.setProgramWeeks(programWeekConverter.toEntities(dto.getProgramWeeks()));
        }
        if (dto.getWeeklyTemplates() != null) {
            entity.setWeeklyTemplates(weeklyTemplateConverter.toEntities(dto.getWeeklyTemplates()));
        }
        return entity;
    }

    public List<TrainingProgramDto> toDtos(List<TrainingProgram> entities) {
        if (entities == null) return null;
        List<TrainingProgramDto> dtos = new ArrayList<TrainingProgramDto>();
        for (TrainingProgram entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<TrainingProgram> toEntities(List<TrainingProgramDto> dtos) {
        if (dtos == null) return null;
        List<TrainingProgram> entities = new ArrayList<TrainingProgram>();
        for (TrainingProgramDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

     private final ProgramWeekConverter programWeekConverter;
     private final WeeklyTemplateConverter weeklyTemplateConverter;
     private final UserService userService;
}
