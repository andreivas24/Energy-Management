package message.dto.mapper;

import message.dto.GroupMessageDto;
import message.dto.GroupMessageSaveDto;
import message.entity.GroupMessage;

public class GroupMessageMapper {

    public static GroupMessage mapToEntity(GroupMessageSaveDto groupMessageSaveDto) {
        return new GroupMessage(groupMessageSaveDto.getSenderId(), groupMessageSaveDto.getSenderName(), groupMessageSaveDto.getGroupId(), groupMessageSaveDto.getContent());
    }

    public static GroupMessageDto mapToDto(GroupMessage groupMessage) {
        return new GroupMessageDto(groupMessage.getSenderId(), groupMessage.getSenderName(), groupMessage.getGroupId(), groupMessage.getContent(), groupMessage.getTimestamp());
    }
}
