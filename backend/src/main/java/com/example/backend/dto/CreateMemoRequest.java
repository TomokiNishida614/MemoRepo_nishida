package com.example.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateMemoRequest {

    @NotBlank(message = "リクエストIDは必須です")
    private String requestId;

    @NotBlank(message = "タイトルを入力してください")
    @Size(max = 10, message = "タイトルは10文字以内で入力してください")
    private String title;

    @NotBlank(message = "本文を入力してください")
    @Size(max = 200, message = "本文は200文字以内で入力してください")
    private String content;

    @NotBlank(message = "重要度を選択してください")
    @Size(max = 1, message = "重要度の形式が不正です")
    private String importance;

    @NotNull(message = "掲載期限を選択してください")
    @Future(message = "掲載期限には未来の日時を指定してください")
    private LocalDateTime postingDeadline;

    // getter/setter
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }
    public LocalDateTime getPostingDeadline() { return postingDeadline; }
    public void setPostingDeadline(LocalDateTime postingDeadline) { this.postingDeadline = postingDeadline; }
}