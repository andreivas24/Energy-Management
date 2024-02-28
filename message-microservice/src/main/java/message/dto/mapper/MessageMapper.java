package message.dto.mapper;

import message.dto.MessageDto;
import message.dto.MessageSaveDto;
import message.entity.Message;

public class MessageMapper {

    public static Message mapToEntity(MessageSaveDto messageSaveDto) {
        return new Message(messageSaveDto.getSenderId(), messageSaveDto.getReceiverId(), messageSaveDto.getSenderName(), messageSaveDto.getReceiverName(), messageSaveDto.getContent());
    }

    public static MessageDto mapToDto(Message message) {
        return new MessageDto(message.getSenderId(), message.getReceiverId(), message.getSenderName(), message.getReceiverName(), message.getContent(), message.getTimestamp(), message.isSeen());
    }
}
