package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.service.facade.UserService;
import fit.smart.smartfitapi.ws.converter.UserConverter;
import fit.smart.smartfitapi.ws.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PatchMapping("me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> body) {
        String email = authentication.getName();
        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");
        if (currentPassword == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().build();
        }
        User updated = service.changePassword(email, currentPassword, newPassword);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("me")
    public ResponseEntity<UserDto> me(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        User user = service.findByEmail(email); // inject repo here or via service

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(converter.toDto(user));
    }

    private final UserService service;
    private final UserConverter converter;
}
