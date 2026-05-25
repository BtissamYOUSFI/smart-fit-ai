package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.User;

import java.util.List;

public interface UserService {
    User findByEmail(String email);
    List<User> findAll();
    User save(User user);
    int deleteByEmail(String email);
    User update(User user);
    /** Returns updated user, or null if currentPassword is wrong, or throws if user not found. */
    User changePassword(String email, String currentPassword, String newPassword);
}
