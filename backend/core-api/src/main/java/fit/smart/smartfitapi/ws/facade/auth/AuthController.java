package fit.smart.smartfitapi.ws.facade.auth;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.security.jwt.JwtUtil;
import fit.smart.smartfitapi.service.impl.auth.AuthService;
import fit.smart.smartfitapi.ws.converter.UserConverter;
import fit.smart.smartfitapi.ws.dto.UserDto;
import fit.smart.smartfitapi.ws.dto.auth.AuthRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth/")
public class AuthController {

    private final AuthService authService;
    private final UserConverter userConverter;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String token= authService.login(request);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody UserDto request) {
        User user = userConverter.toEntity(request);
        String token = authService.register(user);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
