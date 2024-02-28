package message.dto.mapper;

import message.dto.GroupDto;
import message.entity.Group;

public class GroupMapper {
    public static GroupDto mapToDTO(Group group) {
        return new GroupDto(group.getId(), group.getName());
    }
}
