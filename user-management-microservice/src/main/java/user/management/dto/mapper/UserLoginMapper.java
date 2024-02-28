package user.management.dto.mapper;

import user.management.dto.UserLoginDTO;
import user.management.entity.User;

public class UserLoginMapper {

    public static UserLoginDTO mapToDTO(User user, String token) {
        return new UserLoginDTO(user.getId(), user.getRole(), token);
    }
}
