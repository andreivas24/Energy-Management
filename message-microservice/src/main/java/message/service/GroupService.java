package message.service;

import message.config.JwtUtilService;
import message.controller.exception.AuthException;
import message.controller.exception.ResourceNotFoundException;
import message.dto.GroupCreationDto;
import message.dto.GroupDto;
import message.dto.mapper.GroupMapper;
import message.entity.Group;
import message.entity.GroupMember;
import message.repository.GroupMemberRepository;
import message.repository.GroupRepository;
import org.apache.catalina.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupService {
    private static final Logger LOGGER = LoggerFactory.getLogger(GroupService.class);
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final JwtUtilService jwtUtilService;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository, JwtUtilService jwtUtilService) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.jwtUtilService = jwtUtilService;
    }

    public void saveGroup(String authHeader, GroupCreationDto groupCreationDto, UUID adminId){
        validateAdminRole(authHeader);
        Group group = new Group();
        group.setName(groupCreationDto.getName());
        group.setAdminId(adminId);
        groupRepository.save(group);
        for (UUID id: groupCreationDto.getUsers()){
            GroupMember groupMember = new GroupMember();
            groupMember.setGroupId(group.getId());
            groupMember.setUserId(id);
            int index = groupCreationDto.getUsers().indexOf(id);
            groupMember.setName(groupCreationDto.getNames().get(index));
            groupMemberRepository.save(groupMember);
        }
    }

    public List<GroupDto> getAllGroupsByAdminId(String authHeader, UUID adminId) {
        validateAdminRole(authHeader);
        return groupRepository.findAllByAdminId(adminId)
                .stream()
                .map(GroupMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<GroupDto> getAllGroupsByClientId(String authHeader, UUID clientId) {
        validateClientRole(authHeader);
        List<GroupMember> groupMembers = groupMemberRepository.findAllByUserId(clientId);
        List<GroupDto> groupDtos = new ArrayList<>();
        for (GroupMember groupMember: groupMembers){
            Optional<Group> group = groupRepository.findById(groupMember.getGroupId());
            if(group.isPresent()){
                groupDtos.add(GroupMapper.mapToDTO(group.get()));
            }
        }
        return groupDtos;
    }

    public void deleteGroupById(String authHeader, UUID id) {
        validateAdminRole(authHeader);
        Optional<Group> group = groupRepository.findById(id);
        if (!group.isPresent()) {
            LOGGER.error("Group with id {} was not found in db", id);
            throw new ResourceNotFoundException(Group.class.getSimpleName() + " with id: " + id);
        }
        groupRepository.delete(group.get());
        List<GroupMember> groupMembers = groupMemberRepository.findAllByGroupId(group.get().getId());
        for(GroupMember groupMember: groupMembers){
            groupMemberRepository.delete(groupMember);
        }
    }

    public GroupDto getGroupById(String authHeader, UUID id) {
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        Optional<Group> group = groupRepository.findById(id);
        if (!group.isPresent()) {
            LOGGER.error("Group with id {} was not found in db", id);
            throw new ResourceNotFoundException(Group.class.getSimpleName() + " with id: " + id);
        }
        return GroupMapper.mapToDTO(group.get());
    }

    public void validateAdminRole(String authHeader){
        if (!jwtUtilService.isAdminTokenValid(authHeader)){
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
    }

    public void validateClientRole(String authHeader){
        if (!jwtUtilService.isClientTokenValid(authHeader)){
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
    }
}
