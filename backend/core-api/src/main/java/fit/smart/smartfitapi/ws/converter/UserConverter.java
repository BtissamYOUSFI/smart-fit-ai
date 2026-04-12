package fit.smart.smartfitapi.ws.converter;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.ws.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class UserConverter {

    public UserDto toDto(User entity) {
        if (entity == null) return null;
        UserDto dto = new UserDto();
        if (entity.getId() != null) {
            dto.setId(entity.getId());
        }
        if (entity.getName() != null) {
            dto.setName(entity.getName());
        }
        if (entity.getEmail() != null) {
            dto.setEmail(entity.getEmail());
        }
        if (entity.getPasswordHash() != null) {
            dto.setPasswordHash(entity.getPasswordHash());
        }
        if (entity.getCreatedAt() != null) {
            dto.setCreatedAt(entity.getCreatedAt());
        }
        if (entity.getPrograms().isEmpty()) {
            dto.setPrograms(trainingProgramConverter.toDtos(entity.getPrograms()));
        }
        return dto;
    }

    public User toEntity(UserDto dto) {
        if (dto == null) return null;
        User user = new User();
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }
        if (dto.getName() != null) {
            user.setName(dto.getName());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getPasswordHash() != null) {
            user.setPasswordHash(dto.getPasswordHash());
        }
        if (dto.getCreatedAt() != null) {
            user.setCreatedAt(dto.getCreatedAt());
        }
        if (dto.getPrograms() != null) {
            user.setPrograms(trainingProgramConverter.toEntities(dto.getPrograms()));
        }
        return user;
    }

    public List<UserDto> toDtos(List<User> entities) {
        if (entities == null) {
            return null;
        }
        List<UserDto> dtos = new ArrayList<>();
        for (User user : entities) {
            dtos.add(toDto(user));
        }

        return dtos;
    }

    public List<User> toEntities(List<UserDto> dtoList) {
        if (dtoList == null) {
            return null;
        }

        List<User> entities = new ArrayList<>();
        for (UserDto dto : dtoList) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

    private final TrainingProgramConverter trainingProgramConverter ;
}
