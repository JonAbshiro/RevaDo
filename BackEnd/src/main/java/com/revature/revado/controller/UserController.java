package com.revature.revado.controller;

import com.revature.revado.dto.UserCreateRequest;
import com.revature.revado.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping(path = "/user")
    public UUID createUser(UserCreateRequest request) {
        return userService.createUser(request);
    }
}
