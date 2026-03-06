package com.revature.revado.controller;

import com.revature.revado.dto.UserCreateRequest;
import com.revature.revado.entity.User;
import com.revature.revado.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping(path = "/user")
    public UUID createUser(@RequestBody UserCreateRequest request) {
        return userService.createUser(request);
    }

    @GetMapping(path = "/users")
    public List<User> getUsers() {
        return userService.getAll();
    }

    @DeleteMapping(path = "/user/{id}")
    public void deleteUserById(@PathVariable UUID id) {
        userService.deleteUserById(id);
    }
}
