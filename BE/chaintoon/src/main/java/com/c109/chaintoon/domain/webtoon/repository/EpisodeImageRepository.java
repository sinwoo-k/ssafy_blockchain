package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.EpisodeImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeImageRepository extends JpaRepository<EpisodeImage, Integer> {

    // episodeId와 deleted 여부로 이미지 목록 조회
    List<EpisodeImage> findByEpisodeIdAndDeleted(Integer episodeId, String deleted);

    List<EpisodeImage> findByEpisodeId(Integer episodeId);

    List<EpisodeImage> findByEpisodeIdAndDeletedOrderByImageOrderAsc(Integer episodeId, String deleted);
}