package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.MemoListItemData;
import com.example.backend.dto.MemoListResponseData;
import com.example.backend.service.MemoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/memos")
public class MemoController {

    private final MemoService memoService;

    public MemoController(MemoService memoService) {
        this.memoService = memoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<MemoListResponseData>> listMemos(Authentication authentication) {
        // JwtAuthenticationFilterがセットしたuserIdをここで取り出す
        Long currentUserId = (Long) authentication.getPrincipal();

        List<MemoListItemData> memos = memoService.listMemos(currentUserId);
        return ResponseEntity.ok(
                ApiResponse.success("検索が完了しました。", new MemoListResponseData(memos.size(), memos))
        );
    }
}