package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.Episode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Integer> {

    Page<Episode> findByWebtoonId(Integer webtoonId, Pageable pageable);

    Optional<Episode> findTopByWebtoonIdAndDeletedOrderByEpisodeIdDesc(Integer webtoonId, String deleted);

    Optional<Episode> findFirstByWebtoonIdAndDeletedOrderByEpisodeIdAsc(Integer webtoonId, String deleted);

    Optional<Episode> findFirstByWebtoonIdAndDeletedOrderByEpisodeIdDesc(Integer webtoonId, String deleted);
}