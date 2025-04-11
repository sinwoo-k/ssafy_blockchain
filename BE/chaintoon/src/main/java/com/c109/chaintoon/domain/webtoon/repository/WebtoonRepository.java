package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;

public interface WebtoonRepository extends JpaRepository<Webtoon, Integer>, JpaSpecificationExecutor<Webtoon> {

    @Query("SELECT w FROM Webtoon w " +
            "LEFT JOIN User u ON w.userId = u.id " +
            "WHERE LOWER(w.webtoonName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND w.deleted = 'N'")
    Page<Webtoon> findByWebtoonNameContainingOrWriterNicknameContainingIgnoreCase(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    Page<Webtoon> findByWebtoonIdInAndDeleted(Collection<Integer> webtoonIds, String deleted, Pageable pageable);

    Optional<Webtoon> findByWebtoonIdAndDeleted(Integer webtoonId, String deleted);

    Page<Webtoon> findByUserIdAndDeleted(Integer userId, String deleted, Pageable pageable);
}
