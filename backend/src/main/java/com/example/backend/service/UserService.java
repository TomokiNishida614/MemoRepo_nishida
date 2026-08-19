package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserResponseData;
import com.example.backend.entity.User;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
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
}
