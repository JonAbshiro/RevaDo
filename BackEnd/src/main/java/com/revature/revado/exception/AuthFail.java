package com.revature.revado.exception;

public class AuthFail extends RuntimeException {
    public AuthFail(String message) {
        super(message);
    }
}