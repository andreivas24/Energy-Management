package user.management.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user.management.dto.UserDTO;
import user.management.dto.UserLoginDTO;
import user.management.service.LoginService;

import javax.validation.Valid;


@RestController
@CrossOrigin
public class LoginController {
    private final LoginService loginService;


    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/login")
    public ResponseEntity<UserLoginDTO> login(@RequestParam String name, @RequestParam String password) {
        UserLoginDTO userLoginDTO = loginService.login(name, password);
        return new ResponseEntity<>(userLoginDTO, HttpStatus.ACCEPTED);
    }

    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody UserDTO dto) {
        loginService.registerUser(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
