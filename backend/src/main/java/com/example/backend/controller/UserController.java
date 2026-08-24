package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.UserResponseData;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseData>> getMe(Authentication authentication) {
        Long currentUserId = (Long) authentication.getPrincipal();
        UserResponseData data = userService.getCurrentUser(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("取得が完了しました。", data));
    }
}