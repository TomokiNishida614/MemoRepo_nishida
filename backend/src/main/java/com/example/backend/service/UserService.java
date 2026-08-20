package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserResponseData;
import com.example.backend.entity.User;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponseData;
import com.example.backend.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtUtil=jwtUtil;
    }

    public UserResponseData register(RegisterRequest request){
        // password と password_confirm の一致チェック（フィールド横断のためService層で実施）
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR",
                    "パスワードとパスワード確認用が一致しません");
        }

        // メールアドレス重複チェック
        if (userRepository.existsByMailAddress(request.getMailAddress())) {
            throw new BusinessException(HttpStatus.CONFLICT, "DUPLICATE_EMAIL",
                    "そのメールアドレスは既に登録済みです");
        }

        // ハッシュ化して保存（password_confirmはDBに保存しない）
        User user = new User(
                request.getUserName(),
                request.getMailAddress(),
                passwordEncoder.encode(request.getPassword())
        );
        User saved = userRepository.save(user);

        return new UserResponseData(
                saved.getUserId(), saved.getUserName(), saved.getMailAddress(), saved.getCreatedAt()
        );
    }

    public LoginResponseData login(LoginRequest request) {
        User user = userRepository.findByMailAddress(request.getMailAddress())
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_ERROR",
                        "メールアドレスまたはパスワードが正しくありません"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_ERROR",
                    "メールアドレスまたはパスワードが正しくありません");
        }

        String token = jwtUtil.generateToken(user.getUserId());

        return new LoginResponseData(
                token, user.getUserId(), user.getUserName(), jwtUtil.getExpirationSeconds()
        );
    }
}
