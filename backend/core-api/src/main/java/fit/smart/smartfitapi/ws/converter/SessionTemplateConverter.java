package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.SessionTemplate;
import fit.smart.smartfitapi.ws.dto.SessionTemplateDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SessionTemplateConverter {

    public SessionTemplateDto toDto(SessionTemplate entity) {
        if (entity == null) {
            return null;
        }
        SessionTemplateDto dto = new SessionTemplateDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getDayOfWeek() != null) {
            dto.setDayOfWeek(entity.getDayOfWeek());
        }
        if (entity.getOrderInWeek() != null) {
            dto.setOrderInWeek(entity.getOrderInWeek());
        }
        return dto;
    }

    public SessionTemplate toEntity(SessionTemplateDto dto) {
        if (dto == null) {
            return null;
        }
        SessionTemplate entity = new SessionTemplate();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getDayOfWeek() != null) {
            entity.setDayOfWeek(dto.getDayOfWeek());
        }
        if (dto.getOrderInWeek() != null) {
            entity.setOrderInWeek(dto.getOrderInWeek());
        }
        return entity;
    }

    public List<SessionTemplateDto> toDtos(List<SessionTemplate> entities) {
        if (entities == null) {
            return null;
        }
        List<SessionTemplateDto> dtos = new ArrayList<SessionTemplateDto>();
        for (SessionTemplate entity : entities) {
            dtos.add(toDto(entity));
        }
        return dtos;
    }

    public List<SessionTemplate> toEntities(List<SessionTemplateDto> dtos ){
        if (dtos == null) {
            return null;
        }
        List<SessionTemplate> entities = new ArrayList<>();
        for (SessionTemplateDto dto : dtos) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

}
