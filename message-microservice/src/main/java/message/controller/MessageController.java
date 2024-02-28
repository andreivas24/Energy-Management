package message.controller;

import message.dto.GroupMessageDto;
import message.dto.GroupMessageSaveDto;
import message.dto.MessageDto;
import message.dto.MessageSaveDto;
import message.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/messages")
    public ResponseEntity saveMessage(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody MessageSaveDto messageSaveDto) {
        messageService.saveMessage(authHeader, messageSaveDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<MessageDto>> getAllMessagesBySenderIdAndReceiverId(@RequestHeader("Authorization") String authHeader, @PathVariable("senderId") UUID senderId, @PathVariable("receiverId") UUID receiverId) {
        List<MessageDto> messages = messageService.getAllMessagesBySenderIdAndReceiverId(authHeader, senderId, receiverId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping("/groupMessages")
    public ResponseEntity saveGroupMessages(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody GroupMessageSaveDto groupMessageSaveDto) {
        messageService.saveGroupMessage(authHeader, groupMessageSaveDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/groupMessages/{groupId}")
    public ResponseEntity<List<GroupMessageDto>> getAllMessagesBySenderIdAndReceiverId(@RequestHeader("Authorization") String authHeader, @PathVariable("groupId") UUID groupId) {
        List<GroupMessageDto> messages = messageService.getAllGroupMessages(authHeader, groupId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping("/type/{senderName}/{receiverId}")
    public ResponseEntity saveGroupMessages(@RequestHeader("Authorization") String authHeader, @PathVariable("senderName") String senderName, @PathVariable("receiverId") UUID receiverId) {
        messageService.sendTypeNotification(authHeader, senderName, receiverId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
