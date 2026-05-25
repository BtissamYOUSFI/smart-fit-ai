package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.repository.UserRepository;
import fit.smart.smartfitapi.service.facade.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    @Override
    public User findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public User save(User user) {
        if (repository.findByEmail(user.getEmail()) != null) {
            return null;
        }
        return repository.save(user);
    }

    @Override
    @Transactional
    public int deleteByEmail(String email) {
        if (this.findByEmail(email) == null) {
            return -1;
        }
        return repository.deleteByEmail(email);
    }

    @Override
    public User update(User incoming) {
        User existing = incoming.getId() != null
                ? repository.findById(incoming.getId()).orElse(null)
                : repository.findByEmail(incoming.getEmail());
        if (existing == null) return null;
        if (incoming.getName()         != null) existing.setName(incoming.getName());
        if (incoming.getEmail()        != null) existing.setEmail(incoming.getEmail());
        if (incoming.getPasswordHash() != null) existing.setPasswordHash(incoming.getPasswordHash());
        return repository.save(existing);
    }

    @Override
    public User changePassword(String email, String currentPassword, String newPassword) {
        User user = repository.findByEmail(email);
        if (user == null) return null;
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) return null;
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return repository.save(user);
    }

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
}
