package com.example.backend.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String resultCode;

    public BusinessException(HttpStatus status, String resultCode, String message) {
        super(message);
        this.status = status;
        this.resultCode = resultCode;
    }

    public HttpStatus getStatus() { return status; }
    public String getResultCode() { return resultCode; }
}