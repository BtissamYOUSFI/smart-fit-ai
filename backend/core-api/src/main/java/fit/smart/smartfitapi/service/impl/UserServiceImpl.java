package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.User;
import fit.smart.smartfitapi.repository.UserRepository;
import fit.smart.smartfitapi.service.facade.UserService;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
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
    public void delete(User user) {
        repository.delete(user);
    }

    @Override
    public User update(User user) {
        if (repository.findByEmail(user.getEmail()) == null) {
            return null;
        }
        return repository.save(user);
    }

    private final UserRepository repository;

}
