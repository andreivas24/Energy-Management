package user.management.dto.mapper;

import user.management.dto.UserContactDto;
import user.management.entity.User;

public class UserContactsMapper {
    public static UserContactDto mapToDTO(User user) {
        return new UserContactDto(user.getId(), user.getName(), user.getRole());
    }
}
