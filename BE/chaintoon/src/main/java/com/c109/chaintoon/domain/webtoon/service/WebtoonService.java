package com.c109.chaintoon.domain.webtoon.service;

import com.c109.chaintoon.domain.webtoon.dto.request.WebtoonRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
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

    public WebtoonService(WebtoonRepository webtoonRepository) {
        this.webtoonRepository = webtoonRepository;
    }

    @Transactional(readOnly = true)
    public List<WebtoonListResponseDto> getWebtoonList(int page, int pageSize, String orderBy, String genre) {
        Pageable pageable = PageRequest.of(page, pageSize, getSort(orderBy));
        Page<Webtoon> webtoonPage;

        if (genre != null && !genre.isEmpty()) {
            webtoonPage = webtoonRepository.findByGenre(genre, pageable);
        } else {
            webtoonPage = webtoonRepository.findAll(pageable);
        }

        return webtoonPage.getContent().stream()
                .map(webtoon -> {
                    String writer = null;
//                    TODO: 유저 구현 시 변경
//                    userRepository.findById(webtoon.getUserId())
//                            .orElseThrow(() -> new RuntimeException("User not found"))
//                            .getNickname();
                    double rating = webtoon.getRatingCount() == 0 ? 0.0 :
                            Math.round((webtoon.getRatingSum() / (double) webtoon.getRatingCount()) * 100) / 100.0;

                    return new WebtoonListResponseDto(
                            webtoon.getWebtoonId(),
                            webtoon.getUserId(),
                            writer,
                            webtoon.getWebtoonName(),
                            webtoon.getGenre(),
                            webtoon.getGaroThumbnail(),
                            webtoon.getSeroThumbnail(),
                            webtoon.getEpisodeCount().longValue(),
                            webtoon.getViewCount(),
                            rating
                    );
                })
                .collect(Collectors.toList());
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

    public WebtoonResponseDto updateWebtoon(Integer webtoonId, WebtoonRequestDto webtoonRequest, MultipartFile garoImage, MultipartFile seroImage) {
        // 기존 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new RuntimeException("Webtoon not found"));

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
}
