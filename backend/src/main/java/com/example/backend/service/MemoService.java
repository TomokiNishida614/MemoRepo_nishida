package com.example.backend.service;

import com.example.backend.dto.MemoListItemData;
import com.example.backend.entity.Memo;
import com.example.backend.repository.MemoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemoService {

    private final MemoRepository memoRepository;

    public MemoService(MemoRepository memoRepository){
        this.memoRepository=memoRepository;
    }

    public List<MemoListItemData> listMemos(Long currentUserId){
        // ページングは不要、10件固定で取得(機能要件書 F-004-05)
        List<Memo> memos=memoRepository.findActiveMemosOrderByDeadline(
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
                    memo.getUser().getUserId().equals(currentUserId)
                ))
                .collect(Collectors.toList());
    }
}
