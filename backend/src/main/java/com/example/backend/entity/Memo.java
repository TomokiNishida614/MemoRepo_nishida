package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "memos")
public class Memo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memo_id")
    private Long memoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false, length = 10)
    private String title;

    @Column(name = "content", nullable = false, length = 200)
    private String content;

    // "高" "中" "低" のいずれか1文字で保持
    @Column(name = "importance", nullable = false, length = 1)
    private String importance;

    @Column(name = "posting_deadline", nullable = false)
    private LocalDateTime postingDeadline;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Memo() {
    }

    public Memo(User user, String title, String content, String importance, LocalDateTime postingDeadline) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.importance = importance;
        this.postingDeadline = postingDeadline;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getMemoId() { return memoId; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }
    public LocalDateTime getPostingDeadline() { return postingDeadline; }
    public void setPostingDeadline(LocalDateTime postingDeadline) { this.postingDeadline = postingDeadline; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}