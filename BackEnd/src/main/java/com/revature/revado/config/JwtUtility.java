package com.revature.revado.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtility {
    // This key will be used for signing the jwt
    // NOTE: this should be secret, so do not hard-code this value in a real application
    private final String SECRET_KEY = "your-key-should-be-at-least-32-bytes";

    // the JJWT Jwts resource uses the builder design pattern to facilitate creating your JWT
    public String generateAccessToken(UUID userId, String email){
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 minutes
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), Jwts.SIG.HS256)
                .compact();
    }

    // the JWT parser is used to extract information from our JWT, it also uses the builder design pattern
    public String extractId(String token){
        return Jwts.parser()
                // set the secret key we need to use to decrypt the token
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                // actually create the parser
                .build()
                // decrypt the jwt
                .parseSignedClaims(token)
                // get the data from the jwt
                .getPayload()
                // get the subject from the jwt data
                .getSubject();
    }

    public String extractEmail(String token){
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }
}