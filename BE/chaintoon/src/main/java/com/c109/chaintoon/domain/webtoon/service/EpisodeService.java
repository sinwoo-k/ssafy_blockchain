package com.c109.chaintoon.domain.webtoon.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.webtoon.dto.request.EpisodeRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.request.ImageRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.EpisodeListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.EpisodeResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.*;
import com.c109.chaintoon.domain.webtoon.exception.EpisodeImageNotFoundException;
import com.c109.chaintoon.domain.webtoon.exception.EpisodeNotFoundException;
import com.c109.chaintoon.domain.webtoon.exception.RatingDuplicatedException;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeImageRepository;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeRepository;
import com.c109.chaintoon.domain.webtoon.repository.RatingRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final EpisodeImageRepository episodeImageRepository;
    private final WebtoonRepository webtoonRepository;
    private final RatingRepository ratingRepository;
    private final S3Service s3Service;

    // 조회수 증가
    private void increaseViewCount(Integer webtoonId) {
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));
        webtoon.setViewCount(webtoon.getViewCount() + 1);
        webtoonRepository.save(webtoon);
    }

    // 이미지 URL 목록 조회
    private List<String> getImageUrls(Integer episodeId) {
        List<EpisodeImage> episodeImages = episodeImageRepository.findByEpisodeIdAndDeletedOrderByImageOrderAsc(episodeId, "N");
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

    private String uploadThumbnail(Integer episodeId, MultipartFile file) {
        return s3Service.uploadFile(file, "episode/" + episodeId + "/thumbnail");
    }

    private String uploadManuscript(Integer episodeId, MultipartFile file) {
        return s3Service.uploadFile(file, "episode/" + episodeId + "/manuscript");
    }

    private MultipartFile findNewImageByName(List<MultipartFile> newImages, String fileName) {
        return newImages.stream()
                .filter(file -> file != null && file.getOriginalFilename() != null && file.getOriginalFilename().equals(fileName))
                .findFirst()
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<EpisodeListResponseDto> getEpisodeList(Integer webtoonId, int page, int pageSize) {
        // 페이징 처리
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Episode> episodePage = episodeRepository.findByWebtoonIdAndDeleted(webtoonId, "N", pageable);

        // Entity -> DTO 변환
        return episodePage.getContent().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EpisodeResponseDto addEpisode(EpisodeRequestDto episodeRequest, MultipartFile thumbnail, List<MultipartFile> images) {
        // EpisodeRequestDto -> Episode 엔티티 변환
        Episode episode = Episode.builder()
                .webtoonId(episodeRequest.getWebtoonId())
                .episodeName(episodeRequest.getEpisodeName())
                .writerComment(episodeRequest.getWriterComment())
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

        // 썸네일 이미지 저장
        String thumbnailUrl = uploadThumbnail(savedEpisode.getEpisodeId(), thumbnail);
        savedEpisode.setThumbnail(thumbnailUrl);
        episodeRepository.save(savedEpisode);

        // 원고 이미지 S3 & DB 저장
        for (int i = 0; i < images.size(); i++) {
            String imageUrl = uploadManuscript(savedEpisode.getEpisodeId(), images.get(i));
            EpisodeImage episodeImage = EpisodeImage.builder()
                    .episodeId(savedEpisode.getEpisodeId())
                    .imageUrl(imageUrl)
                    .imageOrder(i + 1)
                    .build();
            episodeImageRepository.save(episodeImage);
        }

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
        Episode episode = episodeRepository.findByEpisodeIdAndDeleted(episodeId, "N")
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


    @Transactional
    public EpisodeResponseDto updateEpisode(Integer userId, Integer episodeId, EpisodeRequestDto episodeRequest, MultipartFile thumbnail, List<ImageRequestDto> imageRequests, List<MultipartFile> newImages) {
        // 기존 에피소드 조회
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));

        // 수정 권한 확인
        Webtoon webtoon = webtoonRepository.findById(episode.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(episode.getWebtoonId()));
        if (!webtoon.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("에피소드 수정 권한이 없습니다.");
        }

        // 에피소드 정보 업데이트
        if (episodeRequest != null) {
            episode.setEpisodeName(episodeRequest.getEpisodeName());
            episode.setWriterComment(episodeRequest.getWriterComment());
            episode.setCommentable(episodeRequest.getCommentable());
        }

        // 썸네일 업데이트
        if (thumbnail != null) {
            String thumbnailUrl = uploadThumbnail(episodeId, thumbnail);
            episode.setThumbnail(thumbnailUrl);
        }

        // 이미지 업데이트
        if (imageRequests != null && !imageRequests.isEmpty()) {
            // 기존 이미지 소프트 삭제 (모두 삭제 후 재구성)
            List<EpisodeImage> existingImages = episodeImageRepository.findByEpisodeId(episodeId);
            existingImages.forEach(image -> image.setDeleted("Y"));
            episodeImageRepository.saveAll(existingImages);

            // 새로운 이미지 순서대로 저장
            for (int i = 0; i < imageRequests.size(); i++) {
                ImageRequestDto imageRequest = imageRequests.get(i);
                if (imageRequest.getImageId() != null) {
                    EpisodeImage existingImage = episodeImageRepository.findById(imageRequest.getImageId())
                            .orElseThrow(() -> new EpisodeImageNotFoundException(imageRequest.getImageId()));
                    existingImage.setImageOrder(i + 1); // 순서 업데이트
                    existingImage.setDeleted("N"); // 삭제 취소
                    episodeImageRepository.save(existingImage);
                } else if (imageRequest.getNewImage() != null) {
                    // 새로운 이미지 추가
                    MultipartFile newImageFile = findNewImageByName(newImages, imageRequest.getNewImage());

                    String newImageUrl = uploadManuscript(episodeId, newImageFile);
                    EpisodeImage newEpisodeImage = EpisodeImage.builder()
                            .episodeId(episodeId)
                            .imageUrl(newImageUrl)
                            .imageOrder(i + 1) // 순서 업데이트
                            .build();
                    episodeImageRepository.save(newEpisodeImage);
                }
            }

            // S3 이미지 삭제, 성능 향상을 위해 DB hard 삭제
            List<EpisodeImage> deletedImages = episodeImageRepository.findByEpisodeIdAndDeleted(episodeId, "Y");
            for (EpisodeImage deletedImage : deletedImages) {
                s3Service.deleteFile(deletedImage.getImageUrl());
            }
            episodeImageRepository.deleteAll(deletedImages);
        }

        // 에피소드 저장
        Episode updatedEpisode = episodeRepository.save(episode);

        // DTO 변환 후 반환
        return buildEpisodeResponseDto(updatedEpisode);
    }

    @Transactional
    public void deletedEpisode(Integer userId, Integer episodeId) {
        // 기존 에피소드 조회
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));

        // 삭제 권한 확인
        Webtoon webtoon = webtoonRepository.findById(episode.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(episode.getWebtoonId()));
        if (!webtoon.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("에피소드 삭제 권한이 없습니다.");
        }

        // 에피소드 소프트 삭제
        episode.setDeleted("Y");
        episodeRepository.save(episode);

        // 썸네일, 에피소드 이미지 S3 & DB 삭제
        s3Service.deleteFile(episode.getThumbnail());
        List<EpisodeImage> deletedImages = episodeImageRepository.findByEpisodeId(episodeId);
        for (EpisodeImage deletedImage : deletedImages) {
            s3Service.deleteFile(deletedImage.getImageUrl());
        }
        episodeImageRepository.deleteAll(deletedImages);
    }

    public void addEpisodeRating(Integer userId, Integer episodeId, Integer rating) {
        RatingId ratingId = new RatingId(episodeId, userId);
        Rating ratingEntity = ratingRepository.findById(ratingId).orElse(null);

        // 중복 여부 확인
        if (ratingEntity != null) {
            throw new RatingDuplicatedException("이미 별점을 매긴 에피소드입니다.");
        }

        // 별점 저장
        ratingEntity = new Rating(ratingId, rating);
        ratingRepository.save(ratingEntity);

        // 에피소드 조회 후 별점 반영
        Episode episode = episodeRepository.findByEpisodeIdAndDeleted(episodeId, "N")
                .orElseThrow(() -> new EpisodeNotFoundException(episodeId));
        episode.setRatingSum(episode.getRatingSum() + rating);
        episode.setRatingCount(episode.getRatingCount() + 1);
        episodeRepository.save(episode);

        // 웹툰 조회 후 별점 반영
        Webtoon webtoon = webtoonRepository.findByWebtoonIdAndDeleted(episode.getWebtoonId(), "N")
                .orElseThrow(() -> new WebtoonNotFoundException(episode.getWebtoonId()));
        webtoon.setRatingSum(webtoon.getRatingSum() + rating);
        webtoon.setRatingCount(webtoon.getRatingCount() + 1);
        webtoonRepository.save(webtoon);

    }
}
