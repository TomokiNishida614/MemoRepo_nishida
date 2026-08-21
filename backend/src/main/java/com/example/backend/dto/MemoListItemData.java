package com.example.backend.dto;

import java.time.LocalDateTime;

public class MemoListItemData {
    private Long memoId;
    private Long userId;
    private String userName;
    private String title;
    private String content;
    private String importance;
    private LocalDateTime postingDeadline;
    private boolean isOwner;

    public MemoListItemData(Long memoId, Long userId, String userName, String title, String content,
                             String importance, LocalDateTime postingDeadline, boolean isOwner) {
        this.memoId = memoId;
        this.userId = userId;
        this.userName = userName;
        this.title = title;
        this.content = content;
        this.importance = importance;
        this.postingDeadline = postingDeadline;
        this.isOwner = isOwner;
    }

    public Long getMemoId() { return memoId; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getImportance() { return importance; }
    public LocalDateTime getPostingDeadline() { return postingDeadline; }
    public boolean isOwner() { return isOwner; }
}