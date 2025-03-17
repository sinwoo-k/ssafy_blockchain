package com.c109.chaintoon.domain.webtoon.service;

import com.c109.chaintoon.common.UnauthorizedAccessException;
import com.c109.chaintoon.domain.webtoon.dto.request.WebtoonRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.FavoriteWebtoon;
import com.c109.chaintoon.domain.webtoon.entity.FavoriteWebtoonId;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.c109.chaintoon.domain.webtoon.exeption.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.FavoriteWebtoonRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WebtoonService {

    private final WebtoonRepository webtoonRepository;
    private final FavoriteWebtoonRepository favoriteWebtoonRepository;

    public WebtoonService(WebtoonRepository webtoonRepository, FavoriteWebtoonRepository favoriteWebtoonRepository) {
        this.webtoonRepository = webtoonRepository;
        this.favoriteWebtoonRepository = favoriteWebtoonRepository;
    }

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

    private List<WebtoonListResponseDto> ToDto(Page<Webtoon> webtoonPage) {
        return webtoonPage.getContent().stream()
                .map(webtoon -> {
                    String writer = null;
                    // TODO: 유저 구현 시 변경
                    // writer = userRepository.findById(webtoon.getUserId())
                    //         .orElseThrow(() -> new RuntimeException("User not found"))
                    //         .getNickname();
                    double rating = webtoon.getRatingCount() == 0 ? 0.0 :
                            Math.round((webtoon.getRatingSum() / (double) webtoon.getRatingCount()) * 100) / 100.0;

                    return WebtoonListResponseDto.builder()
                            .webtoonId(webtoon.getWebtoonId())
                            .userId(webtoon.getUserId())
                            .writer(writer)
                            .webtoonName(webtoon.getWebtoonName())
                            .genre(webtoon.getGenre())
                            .garoThumbnail(webtoon.getGaroThumbnail())
                            .seroThumbnail(webtoon.getSeroThumbnail())
                            .episodeCount(webtoon.getEpisodeCount())
                            .viewCount(webtoon.getViewCount())
                            .rating(rating)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> getWebtoonList(int page, int pageSize, String orderBy, String genre) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Webtoon> webtoonPage;

        if (genre != null && !genre.isEmpty()) {
            webtoonPage = webtoonRepository.findByGenre(genre, pageable);
        } else {
            webtoonPage = webtoonRepository.findAll(pageable);
        }

        return ToDto(webtoonPage);
    }


    public WebtoonResponseDto addWebtoon(WebtoonRequestDto webtoonDto, MultipartFile garoImage, MultipartFile seroImage) {
        // 이미지 업로드 TODO: 이미지 추가
        String garoImageUrl = null;
        String seroImageUrl = null;

        // Webtoon 엔티티 생성
        Webtoon webtoon = Webtoon.builder()
                .userId(webtoonDto.getUserId())
                .webtoonName(webtoonDto.getWebtoonName())
                .genre(webtoonDto.getGenre())
                .summary(webtoonDto.getSummary())
                .adaptable(webtoonDto.getAdaptable())
                .garoThumbnail(garoImageUrl)
                .seroThumbnail(seroImageUrl)
                .build();

        // 저장
        Webtoon savedWebtoon = webtoonRepository.save(webtoon);

        // 응답 DTO 생성
        return WebtoonResponseDto.builder()
                .webtoonId(savedWebtoon.getWebtoonId())
                .userId(savedWebtoon.getUserId())
                .webtoonName(savedWebtoon.getWebtoonName())
                .genre(savedWebtoon.getGenre())
                .summary(savedWebtoon.getSummary())
                .adaptable(savedWebtoon.getAdaptable())
                .garoThumbnail(savedWebtoon.getGaroThumbnail())
                .seroThumbnail(savedWebtoon.getSeroThumbnail())
                .build();
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> searchWebtoon(int page, int pageSize, String keyword) {
        // 페이지네이션 및 정렬 설정 (최신 업데이트 순)
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));

        // 웹툰 이름 또는 작가 닉네임으로 검색 (대소문자 구분 없이)
        Page<Webtoon> webtoonPage = webtoonRepository.findByWebtoonNameContainingOrWriterNicknameContainingIgnoreCase(keyword, pageable);

        // 검색 결과 DTO 변환
        return ToDto(webtoonPage);
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> getFavoriteWebtoonList(int page, int pageSize, Integer userId) {
        // 페이지네이션 및 정렬 설정 (최신 업데이트 순)
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));

        // 사용자가 찜한 웹툰 ID 목록 조회
        List<Integer> favoriteWebtoonIds = favoriteWebtoonRepository.findWebtoonIdsByUserId(userId);

        // 찜한 웹툰 ID 목록을 기반으로 웹툰 조회
        Page<Webtoon> webtoonPage = webtoonRepository.findByWebtoonIdIn(favoriteWebtoonIds, pageable);

        // 조회 결과 DTO 변환
        return ToDto(webtoonPage);
    }


    public WebtoonResponseDto getWebtoon(Integer webtoonId) {
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));
        double rating = webtoon.getRatingCount() == 0 ? 0.0 :
                Math.round((webtoon.getRatingSum() / (double) webtoon.getRatingCount()) * 100) / 100.0;

        // 응답 dto 생성
        return WebtoonResponseDto.builder()
                .webtoonId(webtoonId)
                .userId(webtoon.getUserId())
                .webtoonName(webtoon.getWebtoonName())
                .genre(webtoon.getGenre())
                .summary(webtoon.getSummary())
                .adaptable(webtoon.getAdaptable())
                .garoThumbnail(webtoon.getGaroThumbnail())
                .seroThumbnail(webtoon.getSeroThumbnail())
                .episodeCount(webtoon.getEpisodeCount())
                .viewCount(webtoon.getViewCount())
                .rating(rating)
                .build();
    }

    public WebtoonResponseDto updateWebtoon(Integer webtoonId, Integer userId, WebtoonRequestDto webtoonRequest, MultipartFile garoImage, MultipartFile seroImage) {
        // 기존 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // 삭제 권한 없음
        if (!webtoon.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("웹툰 수정 권한이 없습니다.");
        }

        // 이미지 업데이트 (새로운 이미지가 제공된 경우에만 업로드) TODO: 이미지 추가
        if (garoImage != null && !garoImage.isEmpty()) {
            String garoImageUrl = null;
            webtoon.setGaroThumbnail(garoImageUrl);
        }
        if (seroImage != null && !seroImage.isEmpty()) {
            String seroImageUrl = null;
            webtoon.setSeroThumbnail(seroImageUrl);
        }

        // 웹툰 정보 업데이트
        if (webtoonRequest != null) {
            webtoon.setWebtoonName(webtoonRequest.getWebtoonName());
            webtoon.setGenre(webtoonRequest.getGenre());
            webtoon.setSummary(webtoonRequest.getSummary());
            webtoon.setAdaptable(webtoonRequest.getAdaptable());
        }

        // 저장
        Webtoon updatedWebtoon = webtoonRepository.save(webtoon);

        // 응답 DTO 생성
        return WebtoonResponseDto.builder()
                .webtoonId(updatedWebtoon.getWebtoonId())
                .userId(updatedWebtoon.getUserId())
                .webtoonName(updatedWebtoon.getWebtoonName())
                .genre(updatedWebtoon.getGenre())
                .summary(updatedWebtoon.getSummary())
                .adaptable(updatedWebtoon.getAdaptable())
                .garoThumbnail(updatedWebtoon.getGaroThumbnail())
                .seroThumbnail(updatedWebtoon.getSeroThumbnail())
                .build();
    }

    public void deleteWebtoon(Integer webtoonId, Integer userId) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // 삭제 권한 없음
        if (!webtoon.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("웹툰 삭제 권한이 없습니다.");
        }

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
    }
}
