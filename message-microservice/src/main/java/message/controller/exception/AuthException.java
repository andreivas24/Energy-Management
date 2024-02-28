package message.controller.exception;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;

public class AuthException extends CustomException {
    private static final String MESSAGE = "Authentication failed!";
    private static final HttpStatus httpStatus = HttpStatus.CONFLICT;

    public AuthException(String resource) {
        super(MESSAGE, httpStatus, resource, new ArrayList<>());
    }
}
