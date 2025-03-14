package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.FavoriteWebtoon;
import com.c109.chaintoon.domain.webtoon.entity.FavoriteWebtoonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteWebtoonRepository extends JpaRepository<FavoriteWebtoon, FavoriteWebtoonId> {
    @Query("SELECT f.id.webtoonId FROM FavoriteWebtoon f WHERE f.id.userId = :userId")
    List<Integer> findWebtoonIdsByUserId(@Param("userId") Integer userId);
}
