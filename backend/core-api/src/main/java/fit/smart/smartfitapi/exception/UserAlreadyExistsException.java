package fit.smart.smartfitapi.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String email) {
        super("Email already in use: " + email);
    }
}
