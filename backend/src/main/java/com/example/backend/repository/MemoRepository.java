package com.example.backend.repository;

import com.example.backend.entity.Memo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long> {

    // JOIN FETCHで投稿者情報も一緒に取得(N+1問題の回避)
    // 掲載期限が現在より未来のものだけを、期限が早い順に取得
    @Query("SELECT m FROM Memo m JOIN FETCH m.user WHERE m.postingDeadline > :now ORDER BY m.postingDeadline ASC")
    List<Memo> findActiveMemosOrderByDeadline(@Param("now") LocalDateTime now, Pageable pageable);
}