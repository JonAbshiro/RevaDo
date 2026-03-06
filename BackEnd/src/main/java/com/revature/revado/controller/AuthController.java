package com.revature.revado.controller;

import com.revature.revado.entity.User;
import com.revature.revado.exception.AuthFail;
import com.revature.revado.exception.LoginFail;
import com.revature.revado.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService service;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> attemptLogin(@RequestBody User credentials){
        return ResponseEntity.status(HttpStatus.OK).body(service.validateCredentials(credentials));
    }

    @ExceptionHandler(LoginFail.class)
    public ResponseEntity<Map<String, String>> handleLoginFail(LoginFail exception){
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseMap);
    }

    @PostMapping("/auth")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authorization){
        return service.validateToken(authorization) ?
                ResponseEntity.status(HttpStatus.ACCEPTED).body(null) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @ExceptionHandler(AuthFail.class)
    public ResponseEntity<Map<String, String>> handleAuthFail(AuthFail exception){
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
    }

}