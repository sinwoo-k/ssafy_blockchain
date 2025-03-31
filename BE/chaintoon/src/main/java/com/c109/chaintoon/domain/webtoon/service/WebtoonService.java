package com.c109.chaintoon.domain.webtoon.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import com.c109.chaintoon.domain.webtoon.dto.request.WebtoonRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.*;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.FavoriteWebtoonRepository;
import com.c109.chaintoon.domain.webtoon.repository.TagRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class WebtoonService {

    private final S3Service s3Service;
    private final WebtoonRepository webtoonRepository;
    private final FavoriteWebtoonRepository favoriteWebtoonRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    private Sort getSort(String orderBy) {
        switch (orderBy) {
            case "view":
                return Sort.by(Sort.Direction.DESC, "viewCount");
            case "rating":
                return Sort.by(Sort.Direction.DESC, "ratingSum");
            case "latest":
            default:
                return Sort.by(Sort.Direction.DESC, "lastUploadDate");
        }
    }

    // 평균 평점 계산 (소수점 둘째자리까지)
    private double calculateRating(Webtoon webtoon) {
        return webtoon.getRatingCount() == 0 ? 0.0 :
                Math.round((webtoon.getRatingSum() / (double) webtoon.getRatingCount()) * 100) / 100.0;
    }

    private List<WebtoonListResponseDto> toDtoList(Page<Webtoon> webtoonPage) {
        return webtoonPage.getContent().stream()
                .map(webtoon -> {
                    // 작성자 조회
                    String writer = userRepository.findById(webtoon.getUserId())
                             .orElseThrow(() -> new UserIdNotFoundException(webtoon.getUserId()))
                             .getNickname();

                    // 평점 계산
                    double rating = calculateRating(webtoon);

                    return WebtoonListResponseDto.builder()
                            .webtoonId(webtoon.getWebtoonId())
                            .userId(webtoon.getUserId())
                            .writer(writer)
                            .webtoonName(webtoon.getWebtoonName())
                            .genre(webtoon.getGenre())
                            .garoThumbnail(s3Service.getPresignedUrl(webtoon.getGaroThumbnail()))
                            .seroThumbnail(s3Service.getPresignedUrl(webtoon.getSeroThumbnail()))
                            .episodeCount(webtoon.getEpisodeCount())
                            .viewCount(webtoon.getViewCount())
                            .rating(rating)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private WebtoonResponseDto toWebtoonDto(Webtoon webtoon) {
        // 평점 계산
        double rating = calculateRating(webtoon);

        // 태그 조회
        List<String> tags = tagRepository
                .findByTagId_WebtoonId(webtoon.getWebtoonId())
                .stream()
                .map(tag -> tag.getTagId().getTag())
                .toList();

        // 작성자 조회
        User user = userRepository.findById(webtoon.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(webtoon.getUserId()));

        // 응답 dto 생성
        return WebtoonResponseDto.builder()
                .webtoonId(webtoon.getWebtoonId())
                .userId(webtoon.getUserId())
                .writer(user.getNickname())
                .webtoonName(webtoon.getWebtoonName())
                .genre(webtoon.getGenre())
                .summary(webtoon.getSummary())
                .adaptable(webtoon.getAdaptable())
                .garoThumbnail(s3Service.getPresignedUrl(webtoon.getGaroThumbnail()))
                .seroThumbnail(s3Service.getPresignedUrl(webtoon.getSeroThumbnail()))
                .episodeCount(webtoon.getEpisodeCount())
                .viewCount(webtoon.getViewCount())
                .rating(rating)
                .favoriteCount(webtoon.getFavoriteCount())
                .tags(tags)
                .build();
    }

    private String uploadGaroThumbnail(Integer webtoonId, MultipartFile file) {
        return s3Service.uploadFile(file, "webtoon/" + webtoonId  + "/garoThumbnail");
    }

    private String uploadSeroThumbnail(Integer webtoonId, MultipartFile file) {
        return s3Service.uploadFile(file, "webtoon/" + webtoonId  + "/seroThumbnail");
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> getWebtoonList(int page, int pageSize, String orderBy, String genre) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Webtoon> webtoonPage;

        if (genre != null && !genre.isEmpty()) {
            webtoonPage = webtoonRepository.findByGenreAndDeleted(genre, "N", pageable);
        } else {
            webtoonPage = webtoonRepository.findByDeleted("N", pageable);
        }

        return toDtoList(webtoonPage);
    }


    public WebtoonResponseDto addWebtoon(Integer userId, WebtoonRequestDto webtoonDto, MultipartFile garoImage, MultipartFile seroImage) {
        // Webtoon 엔티티 생성
        Webtoon webtoon = Webtoon.builder()
                .userId(userId)
                .webtoonName(webtoonDto.getWebtoonName())
                .genre(webtoonDto.getGenre())
                .summary(webtoonDto.getSummary())
                .adaptable(webtoonDto.getAdaptable())
                .build();

        // 웹툰 저장
        Webtoon savedWebtoon = webtoonRepository.save(webtoon);

        // 태그 저장
        webtoonDto.getTags().forEach(tag -> {
            TagId tagId = new TagId(savedWebtoon.getWebtoonId(), tag);
            tagRepository.save(new Tag(tagId));
        });

        // 이미지 저장
        String garoImageUrl = uploadGaroThumbnail(savedWebtoon.getWebtoonId(), garoImage);
        String seroImageUrl = uploadSeroThumbnail(savedWebtoon.getWebtoonId(), seroImage);
        savedWebtoon.setGaroThumbnail(garoImageUrl);
        savedWebtoon.setSeroThumbnail(seroImageUrl);
        webtoonRepository.save(savedWebtoon);

        // 응답 DTO 생성
        return toWebtoonDto(savedWebtoon);
    }

    public List<WebtoonListResponseDto> getMyWebtoonList(Integer userId, int page, int pageSize) {
        // 페이지네이션 및 정렬 설정 (최신 업데이트 순)
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));
        Page<Webtoon> webtoonPage;

        // 내 웹툰 조회
        webtoonPage = webtoonRepository.findByUserIdAndDeleted(userId, "N", pageable);

        // Dto 변환 후 반환
        return toDtoList(webtoonPage);
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> searchWebtoon(int page, int pageSize, String keyword) {
        // 페이지네이션 및 정렬 설정 (최신 업데이트 순)
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));

        // 웹툰 이름 또는 작가 닉네임으로 검색 (대소문자 구분 없이)
        Page<Webtoon> webtoonPage = webtoonRepository.findByWebtoonNameContainingOrWriterNicknameContainingIgnoreCase(keyword, pageable);

        // 검색 결과 DTO 변환
        return toDtoList(webtoonPage);
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> getFavoriteWebtoonList(int page, int pageSize, Integer userId) {
        // 페이지네이션 및 정렬 설정 (최신 업데이트 순)
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));

        // 사용자가 찜한 웹툰 ID 목록 조회
        List<Integer> favoriteWebtoonIds = favoriteWebtoonRepository.findWebtoonIdsByUserId(userId);

        // 찜한 웹툰 ID 목록을 기반으로 웹툰 조회
        Page<Webtoon> webtoonPage = webtoonRepository.findByWebtoonIdInAndDeleted(favoriteWebtoonIds, "N", pageable);

        // 조회 결과 DTO 변환
        return toDtoList(webtoonPage);
    }


    public WebtoonResponseDto getWebtoon(Integer webtoonId) {
        // 웹툰 엔티티 조회
        Webtoon webtoon = webtoonRepository.findByWebtoonIdAndDeleted(webtoonId, "N")
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // DTO 변환
        return toWebtoonDto(webtoon);
    }

    public WebtoonResponseDto updateWebtoon(Integer webtoonId, Integer userId, WebtoonRequestDto webtoonRequest, MultipartFile garoImage, MultipartFile seroImage) {
        // 기존 웹툰 조회
        Webtoon webtoon = webtoonRepository.findByWebtoonIdAndDeleted(webtoonId, "N")
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // 수정 권한 없음
        if (!webtoon.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("웹툰 수정 권한이 없습니다.");
        }

        // 이미지 업데이트 (새로운 이미지가 제공된 경우에만 업로드)
        if (garoImage != null && !garoImage.isEmpty()) {
            s3Service.deleteFile(webtoon.getGaroThumbnail());
            String garoImageUrl = uploadGaroThumbnail(webtoonId, garoImage);
            webtoon.setGaroThumbnail(garoImageUrl);
        }
        if (seroImage != null && !seroImage.isEmpty()) {
            s3Service.deleteFile(webtoon.getSeroThumbnail());
            String seroImageUrl = uploadSeroThumbnail(webtoonId, seroImage);
            webtoon.setSeroThumbnail(seroImageUrl);
        }

        // 웹툰 정보 업데이트
        if (webtoonRequest != null) {
            webtoon.setWebtoonName(webtoonRequest.getWebtoonName());
            webtoon.setGenre(webtoonRequest.getGenre());
            webtoon.setSummary(webtoonRequest.getSummary());
            webtoon.setAdaptable(webtoonRequest.getAdaptable());

            // 기존 태그 삭제
            List<Tag> oldTags = tagRepository.findByTagId_WebtoonId(webtoon.getWebtoonId());
            tagRepository.deleteAll(oldTags);

            // 새 태그 저장
            webtoonRequest.getTags().forEach(tag -> {
                TagId tagId = new TagId(webtoon.getWebtoonId(), tag);
                tagRepository.save(new Tag(tagId));
            });
        }

        // 저장
        Webtoon updatedWebtoon = webtoonRepository.save(webtoon);

        // 응답 DTO 생성
        return toWebtoonDto(updatedWebtoon);
    }

    public void deleteWebtoon(Integer webtoonId, Integer userId) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findByWebtoonIdAndDeleted(webtoonId, "N")
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // 삭제 권한 없음
        if (!webtoon.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("웹툰 삭제 권한이 없습니다.");
        }

        // S3 이미지 삭제
        s3Service.deleteFile(webtoon.getGaroThumbnail());
        s3Service.deleteFile(webtoon.getSeroThumbnail());

        // 소프트 삭제
        webtoon.setDeleted("Y");
        webtoonRepository.save(webtoon);
    }


    @Transactional
    public void addFavoriteWebtoon(Integer webtoonId, Integer userId) {
        // 복합키 생성
        FavoriteWebtoonId id = new FavoriteWebtoonId(userId, webtoonId);

        // 중복 체크 (이미 찜한 웹툰인지 확인)
        if (favoriteWebtoonRepository.existsById(id)) {
            return;
        }

        // FavoriteWebtoon 엔티티 생성
        FavoriteWebtoon favoriteWebtoon = new FavoriteWebtoon(id);

        // 데이터베이스에 저장
        favoriteWebtoonRepository.save(favoriteWebtoon);
        Webtoon webtoon = webtoonRepository.findByWebtoonIdAndDeleted(webtoonId, "N")
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));
        webtoon.setFavoriteCount(webtoon.getFavoriteCount() + 1);
        webtoonRepository.save(webtoon);
    }

    @Transactional
    public void deleteFavoriteWebtoon(Integer webtoonId, Integer userId) {
        // 복합키 생성
        FavoriteWebtoonId id = new FavoriteWebtoonId(userId, webtoonId);

        // 엔티티 존재 여부 확인
        if (!favoriteWebtoonRepository.existsById(id)) {
            return;
        }

        // 데이터베이스에서 삭제
        favoriteWebtoonRepository.deleteById(id);
        Webtoon webtoon = webtoonRepository.findByWebtoonIdAndDeleted(webtoonId, "N")
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));
        webtoon.setFavoriteCount(webtoon.getFavoriteCount() - 1);
        webtoonRepository.save(webtoon);
    }
}
