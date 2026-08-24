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

import com.example.backend.dto.CreateMemoRequest;
import com.example.backend.dto.MemoResponseData;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
                ApiResponse.success("検索が完了しました。", new MemoListResponseData(memos.size(), memos)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemoResponseData>> createMemo(
            Authentication authentication, @Valid @RequestBody CreateMemoRequest request) {
        Long currentUserId = (Long) authentication.getPrincipal();
        MemoResponseData data = memoService.createMemo(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("メモを作成しました。", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMemo(
            Authentication authentication, @PathVariable Long id) {
        Long currentUserId = (Long) authentication.getPrincipal();
        memoService.deleteMemo(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("メモを削除しました。", null));
    }
}