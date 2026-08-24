package com.example.backend.dto;

import java.time.LocalDateTime;

public class MemoResponseData {
    private Long memoId;
    private Long userId;
    private String title;
    private String content;
    private String importance;
    private LocalDateTime postingDeadline;

    public MemoResponseData(Long memoId, Long userId, String title, String content,
                             String importance, LocalDateTime postingDeadline) {
        this.memoId = memoId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.importance = importance;
        this.postingDeadline = postingDeadline;
    }

    public Long getMemoId() { return memoId; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getImportance() { return importance; }
    public LocalDateTime getPostingDeadline() { return postingDeadline; }
}