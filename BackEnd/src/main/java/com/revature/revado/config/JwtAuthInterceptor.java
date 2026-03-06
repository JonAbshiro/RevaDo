package com.revature.revado.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    private final JwtUtility jwtUtility;

    public JwtAuthInterceptor(JwtUtility jwtUtility) {
        this.jwtUtility = jwtUtility;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler){
        String token = request.getHeader("Authorization");
        System.out.println(token);
        if (token != null) {
            try {
                String id = jwtUtility.extractId(token);
                String email = jwtUtility.extractEmail(token);
                return true;
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return false;
            }
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}