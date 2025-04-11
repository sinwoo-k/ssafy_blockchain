package com.c109.chaintoon.domain.user.repository;

import com.c109.chaintoon.domain.user.entity.Notice;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    Page<Notice> findByUserIdAndDeleted(Integer userId, String deleted, Pageable pageable);

    Long countByUserIdAndCheckedAndDeleted(Integer userId, String checked, String deleted, Limit limit);

    Optional<Notice> findByNoticeIdAndDeleted(Integer noticeId, String deleted);

    void deleteAllByUserId(Integer userId);
}
