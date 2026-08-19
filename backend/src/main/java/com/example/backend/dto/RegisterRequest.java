package com.example.backend.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "リクエストIDは必須です")
    private String requestId;

    @NotBlank(message = "ユーザー名を入力してください")
    @Size(max = 20, message = "ユーザー名は20文字以内で入力してください")
    private String userName;

    @NotBlank(message = "メールアドレスを入力してください")
    @Email(message = "有効なメールアドレスの形式で入力してください")
    @Size(max = 50, message = "メールアドレスは50文字以内で入力してください")
    private String mailAddress;

    @NotBlank(message = "パスワードを入力してください")
    @Pattern(regexp="^[a-zA-Z0-9]{8,20}$", message = "パスワードは8~20文字の半角英数字で入力してください")
    private String password;

    @NotBlank(message = "パスワード確認用を入力してください")
    private String passwordConfirm;

    // getter/setter
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getMailAddress() { return mailAddress; }
    public void setMailAddress(String mailAddress) { this.mailAddress = mailAddress; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPasswordConfirm() { return passwordConfirm; }
    public void setPasswordConfirm(String passwordConfirm) { this.passwordConfirm = passwordConfirm; }
}
