package com.example.backend.dto;

import java.util.List;

public class MemoListResponseData {
    private int totalCount;
    private List<MemoListItemData> memos;

    public MemoListResponseData(int totalCount, List<MemoListItemData> memos) {
        this.totalCount = totalCount;
        this.memos = memos;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public List<MemoListItemData> getMemos() {
        return memos;
    }
}
