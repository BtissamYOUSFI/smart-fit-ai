package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.service.facade.UserService;
import fit.smart.smartfitapi.ws.converter.UserConverter;
import fit.smart.smartfitapi.ws.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/")
@AllArgsConstructor
public class UserController {

    @GetMapping("email/{email}")
    public ResponseEntity<UserDto> findByEmail(@PathVariable String email) {
        User user = service.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(converter.toDto(user));
    }

    @GetMapping("all")
    public ResponseEntity<List<UserDto>> findAll() {
        List<User> users= service.findAll();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(converter.toDtos(users));
    }

    @PostMapping("add-one")
    public ResponseEntity<UserDto> save(@RequestBody UserDto userDto) {
        User user = converter.toEntity(userDto);
        User saved = service.save(user);
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(converter.toDto(saved));
    }

    @DeleteMapping("email/{email}")
    public ResponseEntity<Integer> delete(@PathVariable String email) {
        int result = service.deleteByEmail(email);
        if (result > 0) { return ResponseEntity.ok(result);}
        return ResponseEntity.notFound().build();
    }

    @PutMapping("update")
    public ResponseEntity<UserDto> update(@RequestBody UserDto userDto) {
        User user = converter.toEntity(userDto);
        User updated = service.update(user);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(converter.toDto(updated));
    }

    private final UserService service;
    private final UserConverter converter;
}
