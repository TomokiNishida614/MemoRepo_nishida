package com.example.backend.dto;

public class LoginResponseData {
    private String accessToken;
    private Long userId;
    private String userName;
    private long expiresIn;

    public LoginResponseData(String accessToken, Long userId, String userName, long expiresIn) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.userName = userName;
        this.expiresIn = expiresIn;
    }

    public String getAccessToken() { return accessToken; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public long getExpiresIn() { return expiresIn; }
}