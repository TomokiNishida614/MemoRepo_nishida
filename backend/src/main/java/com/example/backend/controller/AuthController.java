package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserResponseData;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseData>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponseData data = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("ユーザー登録が完了しました。", data));
    }
    
}
