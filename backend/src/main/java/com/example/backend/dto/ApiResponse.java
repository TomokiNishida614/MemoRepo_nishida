package com.example.backend.dto;

public class ApiResponse<T> {
    private String resultCode;
    private String message;
    private T data;

    public ApiResponse(String resultCode, String message, T data) {
        this.resultCode = resultCode;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("SUCCESS", message, data);
    }

    public static <T> ApiResponse<T> error(String resultCode, String message) {
        return new ApiResponse<>(resultCode, message, null);
    }

    public String getResultCode() { return resultCode; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}