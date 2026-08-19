package com.example.backend.dto;

import java.time.LocalDateTime;

public class UserResponseData {
    private Long userId;
    private String userName;
    private String mailAddress;
    private LocalDateTime createdAt;

    public UserResponseData(Long userId, String userName, String mailAddress, LocalDateTime createdAt) {
        this.userId = userId;
        this.userName = userName;
        this.mailAddress = mailAddress;
        this.createdAt = createdAt;
    }

    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getMailAddress() { return mailAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
