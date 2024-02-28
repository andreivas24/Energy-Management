package user.management.dto.mapper;

import user.management.entity.User;
import user.management.dto.UserDTO;

public class UserMapper {
    public static User mapToEntity(UserDTO userDTO) {
        return new User(userDTO.getName(), userDTO.getPassword(), userDTO.getRole());
    }

    public static UserDTO mapToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getPassword(), user.getRole());
    }
}
