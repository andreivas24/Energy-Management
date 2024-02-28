package user.management.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user.management.dto.UserContactDto;
import user.management.dto.UserDTO;
import user.management.service.UserService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/admin/users")
    public ResponseEntity saveUser(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserDTO dto) {
        userService.saveUser(authHeader, dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        List<UserDTO> userDTOList = userService.getAllUsers(authHeader);
        return new ResponseEntity<>(userDTOList, HttpStatus.OK);
    }

    @GetMapping("/admin/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@RequestHeader("Authorization") String authHeader, @PathVariable("id") UUID id) {
        UserDTO userDTO = userService.getUserById(authHeader, id);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity deleteUserById(@RequestHeader("Authorization") String authHeader, @PathVariable("id") UUID id) {
        userService.deleteUserById(authHeader, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/admin/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserDTO dto, @PathVariable("id") UUID id) {
        UserDTO userDTO = userService.updateUser(authHeader, id, dto);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<UserContactDto>> getContacts(@RequestHeader("Authorization") String authHeader) {
        List<UserContactDto> contacts = userService.getContacts(authHeader);
        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    @GetMapping("/contacts/{id}")
    public ResponseEntity<UserContactDto> getContactById(@RequestHeader("Authorization") String authHeader, @PathVariable("id") UUID id){
        UserContactDto contact = userService.getContactById(authHeader, id);
        return new ResponseEntity<>(contact, HttpStatus.OK);
    }
}
