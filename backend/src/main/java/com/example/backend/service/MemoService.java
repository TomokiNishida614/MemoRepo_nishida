package com.example.backend.service;

import com.example.backend.dto.CreateMemoRequest;
import com.example.backend.dto.MemoListItemData;
import com.example.backend.dto.MemoResponseData;
import com.example.backend.entity.Memo;
import com.example.backend.entity.User;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.MemoRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemoService {

    private final MemoRepository memoRepository;
    private final UserRepository userRepository;

    public MemoService(MemoRepository memoRepository, UserRepository userRepository) {
        this.memoRepository = memoRepository;
        this.userRepository = userRepository;
    }

    public List<MemoListItemData> listMemos(Long currentUserId) {
        // ページングは不要、10件固定で取得(機能要件書 F-004-05)
        List<Memo> memos = memoRepository.findActiveMemosOrderByDeadline(
                LocalDateTime.now(), PageRequest.of(0, 10));

        return memos.stream()
                .map(memo -> new MemoListItemData(
                        memo.getMemoId(),
                        memo.getUser().getUserId(),
                        memo.getUser().getUserName(),
                        memo.getTitle(),
                        memo.getContent(),
                        memo.getImportance(),
                        memo.getPostingDeadline(),
                        memo.getUser().getUserId().equals(currentUserId)))
                .collect(Collectors.toList());
    }

    public MemoResponseData createMemo(Long currentUserId, CreateMemoRequest request) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_ERROR",
                        "ユーザー情報が見つかりません"));

        Memo memo = new Memo(
                user,
                request.getTitle(),
                request.getContent(),
                request.getImportance(),
                request.getPostingDeadline());
        Memo saved = memoRepository.save(memo);

        return new MemoResponseData(
                saved.getMemoId(), user.getUserId(), saved.getTitle(),
                saved.getContent(), saved.getImportance(), saved.getPostingDeadline());
    }

    public void deleteMemo(Long memoId, Long currentUserId) {
        Memo memo = memoRepository.findById(memoId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "NOT_FOUND",
                        "指定されたメモが見つかりません"));

        if (!memo.getUser().getUserId().equals(currentUserId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "FORBIDDEN",
                    "他のユーザーのメモは削除できません");
        }

        memoRepository.delete(memo);
    }
}
