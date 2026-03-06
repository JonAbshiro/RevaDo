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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtility jwtUtility;

    public Map<String, String> validateCredentials(User credentials){
        String username = credentials.getUsername();
        String password = credentials.getPassword();
        Map<String, String> responseMap = new HashMap<>();
        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);
        if(user.isPresent()){
            UUID userId = user.get().getId();
            String token = jwtUtility.generateAccessToken(userId, username);
            responseMap.put("token", token);
            return responseMap;
        }
        throw new LoginFail("Login attempt failed");
    }

    public boolean validateToken(String token){
        if (token == null){
            throw new AuthFail("Token not found");
        }
        try{
            System.out.println(token);
            String tokenSplit = token.split(" ")[1];
            String id = jwtUtility.extractId(tokenSplit);
            System.out.println(id);
            String username = jwtUtility.extractUsername(tokenSplit);
            System.out.println(username);
            Optional<User> user = userRepository.findById(UUID.fromString(id));
            if(user.isPresent()){
                User foundUser = user.get();
                return foundUser.getId().equals(UUID.fromString(id)) && foundUser.getUsername().equals(username);
            }
            return false;
        } catch (JwtException e){
            throw new AuthFail("Token could not be parsed");
        }
    }
    
    public UUID createUser(UserCreateRequest request) {
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(newUser);
        return newUser.getId();
    }
}