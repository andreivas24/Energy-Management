package message.service;

import message.config.JwtUtilService;
import message.controller.exception.AuthException;
import message.dto.GroupMessageDto;
import message.dto.GroupMessageSaveDto;
import message.dto.MessageDto;
import message.dto.MessageSaveDto;
import message.dto.mapper.GroupMessageMapper;
import message.dto.mapper.MessageMapper;
import message.entity.GroupMessage;
import message.entity.Message;
import message.repository.GroupMessageRepository;
import message.repository.MessageRepository;
import org.apache.catalina.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(MessageService.class);
    private final JwtUtilService jwtUtilService;
    private final MessageRepository messageRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(JwtUtilService jwtUtilService, MessageRepository messageRepository, GroupMessageRepository groupMessageRepository, SimpMessagingTemplate messagingTemplate) {
        this.jwtUtilService = jwtUtilService;
        this.messageRepository = messageRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void saveMessage(String authHeader, MessageSaveDto messageSaveDto){
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        Message message = MessageMapper.mapToEntity(messageSaveDto);
        message.setSeen(false);
        message.setTimestamp(Instant.now().toEpochMilli());
        messageRepository.save(message);
        sendNewMessageNotification(message);
    }

    public List<MessageDto> getAllMessagesBySenderIdAndReceiverId(String authHeader, UUID senderId, UUID receiverId) {
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        List<Message> messages = messageRepository.findAllBySenderIdAndReceiverId(senderId, receiverId);
        seeMessages(senderId, messages);
        return messages
                .stream()
                .map(MessageMapper::mapToDto)
                .collect(Collectors.toList());
    }

    public void saveGroupMessage(String authHeader, GroupMessageSaveDto groupMessageSaveDto){
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        GroupMessage groupMessage = GroupMessageMapper.mapToEntity(groupMessageSaveDto);
        groupMessage.setTimestamp(Instant.now().toEpochMilli());
        groupMessageRepository.save(groupMessage);
        sendNewGroupMessageNotification(groupMessage);
    }

    public List<GroupMessageDto> getAllGroupMessages(String authHeader, UUID groupId) {
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        return groupMessageRepository.findAllByGroupId(groupId)
                .stream()
                .map(GroupMessageMapper::mapToDto)
                .collect(Collectors.toList());
    }

    public void seeMessages(UUID senderId, List<Message> messages){
        for (Message message: messages) {
            if (message.getReceiverId().equals(senderId) && !message.isSeen()){
                message.setSeen(true);
                sendMessageSeenNotification(message);
                messageRepository.save(message);
            }
        }
    }

    public void sendMessageSeenNotification(Message message){
        String url = "/topic/" + message.getSenderId().toString() + "/message/seen";
        String notification = "Your message was seen by " + message.getReceiverName();
        messagingTemplate.convertAndSend(url, notification);
    }

    public void sendNewMessageNotification(Message message){
        String url = "/topic/" + message.getReceiverId().toString() + "/message/new";
        String notification = "You have a new message from " + message.getSenderName();
        messagingTemplate.convertAndSend(url, notification);
    }

    public void sendTypeNotification(String authHeader, String senderName, UUID receiverId){
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        String url = "/topic/" + receiverId + "/types";
        String notification = senderName + " types a new message";
        messagingTemplate.convertAndSend(url, notification);
    }

    public void sendNewGroupMessageNotification(GroupMessage message){
        String url = "/topic/" + message.getGroupId().toString() + "/groupMessage/new";
        messagingTemplate.convertAndSend(url, "");
    }
}
