package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "リクエストIDは必須です")
    private String requestId;

    @NotBlank(message = "メールアドレスを入力してください")
    private String mailAddress;

    @NotBlank(message = "パスワードを入力してください")
    private String password;

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getMailAddress() { return mailAddress; }
    public void setMailAddress(String mailAddress) { this.mailAddress = mailAddress; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}