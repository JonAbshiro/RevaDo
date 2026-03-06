package com.revature.revado.service;

import com.revature.revado.config.JwtUtility;
import com.revature.revado.dto.UserCreateRequest;
import com.revature.revado.entity.User;
import com.revature.revado.exception.AuthFail;
import com.revature.revado.exception.LoginFail;
import com.revature.revado.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtility jwtUtility;

    public Map<String, String> validateCredentials(User credentials) {
        String email = credentials.getEmail();
        String password = credentials.getPassword();
        Map<String, String> responseMap = new HashMap<>();
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            UUID userId = user.get().getId();
            String token = jwtUtility.generateAccessToken(userId, email);
            responseMap.put("token", token);
            return responseMap;
        }
        throw new LoginFail("Invalid Credentials");
    }

    public boolean validateToken(String token) {
        if (token == null) {
            throw new AuthFail("Token not found");
        }
        try {
            String tokenSplit = token.split(" ")[1];
            String id = jwtUtility.extractId(tokenSplit);
            String email = jwtUtility.extractEmail(tokenSplit);
            Optional<User> user = userRepository.findById(UUID.fromString(id));
            if (user.isPresent()) {
                User foundUser = user.get();
                return foundUser.getId().equals(UUID.fromString(id)) && foundUser.getEmail().equals(email);
            }
            return false;
        } catch (JwtException e) {
            throw new AuthFail("Token could not be parsed");
        }
    }

    public UUID createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already in use");
        }
        System.out.println(request);
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(newUser);
        return newUser.getId();
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public void deleteUserById(UUID id) {
        userRepository.deleteById(id);
    }
}