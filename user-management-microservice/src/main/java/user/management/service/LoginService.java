package user.management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import user.management.config.JwtUtilService;
import user.management.controller.exception.ResourceNotFoundException;
import user.management.dto.UserDTO;
import user.management.dto.UserLoginDTO;
import user.management.dto.mapper.UserLoginMapper;
import user.management.dto.mapper.UserMapper;
import user.management.entity.Role;
import user.management.entity.User;
import user.management.repository.UserRepository;

import java.util.Optional;

@Service
public class LoginService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final JwtUtilService jwtUtilService;

    public LoginService(UserRepository userRepository, JwtUtilService jwtUtilService) {
        this.userRepository = userRepository;
        this.jwtUtilService = jwtUtilService;
    }

    public UserLoginDTO login(String name, String password){
        Optional<User> user = userRepository.findByNameAndPassword(name, password);
        if (!user.isPresent()) {
            LOGGER.error("User with name {} and password {} was not found in db", name, password);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with name: " + name +
                    " and password: " + password);
        }
        if (user.get().getRole().equals(Role.ADMIN)){
            String token = jwtUtilService.generateToken("ADMIN");
            return UserLoginMapper.mapToDTO(user.get(), token);
        }
        String token = jwtUtilService.generateToken("CLIENT");
        return UserLoginMapper.mapToDTO(user.get(), token);
    }

    public void registerUser(UserDTO userDTO) {
        User user = UserMapper.mapToEntity(userDTO);
        userRepository.save(user);
    }
}
