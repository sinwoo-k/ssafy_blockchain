package com.c109.chaintoon.domain.webtoon.service;

import com.c109.chaintoon.domain.webtoon.dto.request.EpisodeRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.EpisodeListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.EpisodeResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.Episode;
import com.c109.chaintoon.domain.webtoon.entity.EpisodeImage;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.c109.chaintoon.domain.webtoon.exeption.EpisodeNotFoundException;
import com.c109.chaintoon.domain.webtoon.exeption.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeImageRepository;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final EpisodeImageRepository episodeImageRepository;
    private final WebtoonRepository webtoonRepository;

    public EpisodeService(EpisodeRepository episodeRepository, EpisodeImageRepository episodeImageRepository, WebtoonRepository webtoonRepository) {
        this.episodeRepository = episodeRepository;
        this.episodeImageRepository = episodeImageRepository;
        this.webtoonRepository = webtoonRepository;
    }

    // 조회수 증가
    private void increaseViewCount(Integer webtoonId) {
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));
        webtoon.setViewCount(webtoon.getViewCount() + 1);
        webtoonRepository.save(webtoon);
    }

    // 이미지 URL 목록 조회
    private List<String> getImageUrls(Integer episodeId) {
        List<EpisodeImage> episodeImages = episodeImageRepository.findByEpisodeIdAndDeleted(episodeId, "N");
        return episodeImages.stream()
                .map(EpisodeImage::getImageUrl)
                .collect(Collectors.toList());
    }

    // 평균 평점 계산 (소수점 둘째자리까지)
    private double calculateRating(Episode episode) {
        return episode.getRatingCount() == 0 ? 0.0 :
                Math.round((episode.getRatingSum() / (double) episode.getRatingCount()) * 100) / 100.0;
    }

    private EpisodeListResponseDto toListDto(Episode episode) {
        // 평균 평점 계산
        double rating = calculateRating(episode);

        return EpisodeListResponseDto.builder()
                .episodeId(episode.getEpisodeId())
                .webtoonId(episode.getWebtoonId())
                .episodeName(episode.getEpisodeName())
                .uploadDate(episode.getUploadDate())
                .commentCount(episode.getCommentCount())
                .rating(rating)
                .build();
    }

    private EpisodeResponseDto buildEpisodeResponseDto(Episode episode) {
        // 이미지 URL 목록 조회
        List<String> imageUrls = getImageUrls(episode.getEpisodeId());

        // 평균 평점 계산
        double rating = calculateRating(episode);

        // DTO 변환
        return EpisodeResponseDto.builder()
                .episodeId(episode.getEpisodeId())
                .webtoonId(episode.getWebtoonId())
                .episodeName(episode.getEpisodeName())
                .writerComment(episode.getWriterComment())
                .commentable(episode.getCommentable())
                .uploadDate(episode.getUploadDate())
                .thumbnail(episode.getThumbnail())
                .commentCount(episode.getCommentCount())
                .rating(rating)
                .previousEpisodeId(episode.getPreviousEpisodeId())
                .nextEpisodeId(episode.getNextEpisodeId())
                .images(imageUrls)
                .build();
    }

    @Transactional(readOnly = true)
    public List<EpisodeListResponseDto> getEpisodeList(Integer webtoonId, int page, int pageSize) {
        // 페이징 처리
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Episode> episodePage = episodeRepository.findByWebtoonId(webtoonId, pageable);

        // Entity -> DTO 변환
        return episodePage.getContent().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EpisodeResponseDto addEpisode(EpisodeRequestDto episodeRequest, MultipartFile thumbnail, List<MultipartFile> images) {
        // TODO: 이미지 추가 후 변경
        String thumbnailUrl = null;

        // EpisodeRequestDto -> Episode 엔티티 변환
        Episode episode = Episode.builder()
                .webtoonId(episodeRequest.getWebtoonId())
                .episodeName(episodeRequest.getEpisodeName())
                .writerComment(episodeRequest.getWriterComment())
                .thumbnail(thumbnailUrl)
                .commentable(episodeRequest.getCommentable())
                .build();

        // 이전 에피소드 조회 (deleted = 'N', 동일한 webtoonId를 가진 가장 최근 에피소드)
        Episode previousEpisode = episodeRepository.findTopByWebtoonIdAndDeletedOrderByEpisodeIdDesc(
                episodeRequest.getWebtoonId(), "N")
                .orElse(null);

        // 이전 에피소드가 있는 경우, 현재 에피소드의 previousEpisodeId 설정
        if (previousEpisode != null) {
            episode.setPreviousEpisodeId(previousEpisode.getEpisodeId());
        }
        else {
            episode.setPreviousEpisodeId(0);
        }

        // 현재 에피소드 저장
        Episode savedEpisode = episodeRepository.save(episode);

        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(savedEpisode.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(savedEpisode.getWebtoonId()));

        // 에피소드 수 증가, 최근 업로드 날짜 변경
        webtoon.setEpisodeCount(webtoon.getEpisodeCount() + 1);
        webtoon.setLastUploadDate(savedEpisode.getUploadDate());
        webtoonRepository.save(webtoon);

        // 이전 에피소드의 nextEpisodeId를 현재 에피소드로 업데이트
        if (previousEpisode != null) {
            previousEpisode.setNextEpisodeId(savedEpisode.getEpisodeId());
            episodeRepository.save(previousEpisode);
        }

        // 저장된 에피소드 DTO 변환 후 반환
        return buildEpisodeResponseDto(savedEpisode);
    }

    public EpisodeResponseDto getEpisode(Integer episodeId) {
        // 에피소드 조회
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));

        // 조회수 증가
        increaseViewCount(episode.getWebtoonId());

        // Dto 변환 후 반환
        return buildEpisodeResponseDto(episode);
    }

    public EpisodeResponseDto getFirstEpisode(Integer webtoonId) {
        // 첫화 조회
        Episode episode = episodeRepository.findFirstByWebtoonIdAndDeletedOrderByEpisodeIdAsc(webtoonId, "N")
                .orElseThrow(() -> new EpisodeNotFoundException(0));

        // 조회수 증가
        increaseViewCount(webtoonId);

        // Dto 변환 후 반환
        return buildEpisodeResponseDto(episode);
    }

    public EpisodeResponseDto getLatestEpisode(Integer webtoonId) {
        // 최신화 조회
        Episode episode = episodeRepository.findFirstByWebtoonIdAndDeletedOrderByEpisodeIdDesc(webtoonId, "N")
                .orElseThrow(() -> new EpisodeNotFoundException(0));

        // 조회수 증가
        increaseViewCount(webtoonId);

        // Dto 변환 후 반환
        return buildEpisodeResponseDto(episode);
    }


    public EpisodeResponseDto updateEpisode() {
        return null;
    }
}
