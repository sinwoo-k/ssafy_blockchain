package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WebtoonRepository extends JpaRepository<Webtoon, Integer> {

    Page<Webtoon> findByGenre(String genre, Pageable pageable);

    Page<Webtoon> findByWebtoonIdIn(List<Integer> webtoonIds, Pageable pageable);

    @Query("SELECT w FROM Webtoon w " +
            "LEFT JOIN User u ON w.userId = u.userId " +
            "WHERE LOWER(w.webtoonName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Webtoon> findByWebtoonNameContainingOrWriterNicknameContainingIgnoreCase(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
