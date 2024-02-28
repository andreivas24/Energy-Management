package message.controller;

import message.dto.GroupCreationDto;
import message.dto.GroupDto;
import message.service.GroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/groups")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/admin/{adminId}")
    public ResponseEntity saveGroup(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody GroupCreationDto groupCreationDto, @PathVariable("adminId") UUID id){
        groupService.saveGroup(authHeader, groupCreationDto, id);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<GroupDto>> findAllGroupsByAdminId(@RequestHeader("Authorization") String authHeader, @PathVariable("adminId") UUID id){
        List<GroupDto> groupDtos = groupService.getAllGroupsByAdminId(authHeader, id);
        return new ResponseEntity<>(groupDtos, HttpStatus.OK);
    }

    @GetMapping("/client/{adminId}")
    public ResponseEntity<List<GroupDto>> findAllGroupsByClientId(@RequestHeader("Authorization") String authHeader, @PathVariable("adminId") UUID id){
        List<GroupDto> groupDtos = groupService.getAllGroupsByClientId(authHeader, id);
        return new ResponseEntity<>(groupDtos, HttpStatus.OK);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupById(@RequestHeader("Authorization") String authHeader, @PathVariable("groupId") UUID id){
        GroupDto group = groupService.getGroupById(authHeader, id);
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    @DeleteMapping("/admin/{groupId}")
    public ResponseEntity deleteGroupById(@RequestHeader("Authorization") String authHeader, @PathVariable("groupId") UUID id){
        groupService.deleteGroupById(authHeader, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
