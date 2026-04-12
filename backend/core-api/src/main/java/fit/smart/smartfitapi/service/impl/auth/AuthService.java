package fit.smart.smartfitapi.service.impl.auth;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.repository.UserRepository;
import fit.smart.smartfitapi.security.jwt.JwtUtil;
import fit.smart.smartfitapi.ws.dto.auth.AuthRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
     private final AuthenticationManager authManager;
     private final JwtUtil jwtUtil;
     private final UserRepository userRepository;
     private final PasswordEncoder passwordEncoder;

    public String login(AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        return jwtUtil.generateToken(request.getEmail());
    }

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail());
    }
}
