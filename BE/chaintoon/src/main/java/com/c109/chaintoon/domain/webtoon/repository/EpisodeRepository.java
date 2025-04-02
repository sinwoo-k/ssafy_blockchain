package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.Episode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Integer> {

    Page<Episode> findByWebtoonIdAndDeleted(Integer webtoonId, String deleted, Pageable pageable);

    Optional<Episode> findTopByWebtoonIdAndDeletedOrderByEpisodeIdDesc(Integer webtoonId, String deleted);

    Optional<Episode> findFirstByWebtoonIdAndDeletedOrderByEpisodeIdAsc(Integer webtoonId, String deleted);

    Optional<Episode> findFirstByWebtoonIdAndDeletedOrderByEpisodeIdDesc(Integer webtoonId, String deleted);

    Optional<Episode> findByEpisodeIdAndDeleted(Integer episodeId, String deleted);

    @Modifying
    @Query("UPDATE Episode e SET e.commentCount = e.commentCount + 1 WHERE e.episodeId = :episodeId")
    void incrementCommentCount(@Param("episodeId") Integer episodeId);

    @Modifying
    @Query("UPDATE Episode e SET e.commentCount = e.commentCount - 1 WHERE e.episodeId = :episodeId")
    void decrementCommentCount(@Param("episodeId") Integer episodeId);
}