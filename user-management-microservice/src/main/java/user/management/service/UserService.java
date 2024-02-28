package user.management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import user.management.config.JwtUtilService;
import user.management.controller.exception.AuthException;
import user.management.controller.exception.ResourceNotFoundException;
import user.management.dto.UserContactDto;
import user.management.dto.UserDTO;
import user.management.dto.mapper.UserContactsMapper;
import user.management.dto.mapper.UserMapper;
import user.management.entity.User;
import user.management.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final JwtUtilService jwtUtilService;
    @Value("${endpoints.device_service}")
    private String BASE_URI;

    public UserService(UserRepository userRepository, JwtUtilService jwtUtilService) {
        this.userRepository = userRepository;
        this.jwtUtilService = jwtUtilService;
        this.restTemplate = new RestTemplate();
    }

    public void saveUser(String authHeader, UserDTO userDTO) {
        validateAdminRole(authHeader);
        User user = UserMapper.mapToEntity(userDTO);
        userRepository.save(user);
    }

    public List<UserDTO> getAllUsers(String authHeader) {
        validateAdminRole(authHeader);
        return userRepository.findAll()
                .stream()
                .map(UserMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(String authHeader, UUID id) {
        validateAdminRole(authHeader);
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserMapper.mapToDTO(user.get());
    }

    public void deleteUserById(String authHeader, UUID id) {
        validateAdminRole(authHeader);
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        userRepository.delete(user.get());
        restTemplate.delete(BASE_URI + "/user/" + id);
    }

    public UserDTO updateUser(String authHeader, UUID id, UserDTO userDTO) {
        validateAdminRole(authHeader);
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        if(!user.get().getName().equals(userDTO.getName())){
            user.get().setName(userDTO.getName());
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(BASE_URI + "/admin/mappings/" + id)
                            .queryParam("name", userDTO.getName());
            ResponseEntity<Void> responseEntity = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.PUT,
                    null,
                    Void.class
            );
        }
        user.get().setPassword(userDTO.getPassword());
        user.get().setRole(userDTO.getRole());
        userRepository.save(user.get());
        return UserMapper.mapToDTO(user.get());
    }

    public List<UserContactDto> getContacts(String authHeader) {
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        List<User> users = userRepository.findAll();
        users.sort(Comparator.comparing(User::getName));

        return users.stream()
                .map(UserContactsMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserContactDto getContactById(String authHeader, UUID id) {
        if (!jwtUtilService.isClientTokenValid(authHeader) && !jwtUtilService.isAdminTokenValid(authHeader)) {
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserContactsMapper.mapToDTO(user.get());
    }

    public void validateAdminRole(String authHeader){
        if (!jwtUtilService.isAdminTokenValid(authHeader)){
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
    }
}
