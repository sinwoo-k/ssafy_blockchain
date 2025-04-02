package com.c109.chaintoon.domain.fanart.service;

import com.c109.chaintoon.common.exception.DuplicatedException;
import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.fanart.dto.request.FanartRequestDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartResponseDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartListResponseDto;
import com.c109.chaintoon.domain.fanart.entity.FanartPreference;
import com.c109.chaintoon.domain.fanart.exception.FanartPreferenceNotFoundException;
import com.c109.chaintoon.domain.fanart.repository.FanartPreferenceRepository;
import com.c109.chaintoon.domain.fanart.specification.FanartSpecification;
import com.c109.chaintoon.domain.search.code.SearchType;
import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import com.c109.chaintoon.domain.user.service.NoticeService;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.c109.chaintoon.domain.fanart.exception.FanartNotFoundException;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.fanart.repository.FanartRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FanartService {

    private final FanartRepository fanartRepository;
    private final WebtoonRepository webtoonRepository;
    private final UserRepository userRepository;
    private final FanartPreferenceRepository fanartPreferenceRepository;
    private final S3Service s3Service;
    private final NoticeService noticeService;

    private String uploadFanartImage(Integer fanartId, MultipartFile file) {
        return s3Service.uploadFile(file, "fanart/" + fanartId + "/image");
    }

    private FanartListResponseDto toFanartListResponseDto(Fanart fanart) {
        return FanartListResponseDto.builder()
                .fanartId(fanart.getFanartId())
                .webtoonId(fanart.getWebtoonId())
                .fanartName(fanart.getFanartName())
                .fanartImage(s3Service.getPresignedUrl(fanart.getFanartImage()))
                .build();
    }

    private FanartResponseDto toFanartResponseDto(Fanart fanart, User user, Webtoon webtoon) {
        return FanartResponseDto.builder()
                .fanartId(fanart.getFanartId())
                .userId(fanart.getUserId())
                .nickname(user.getNickname())
                .profileImage(s3Service.getPresignedUrl(user.getProfileImage()))
                .webtoonId(webtoon.getWebtoonId())
                .webtoonName(webtoon.getWebtoonName())
                .fanartName(fanart.getFanartName())
                .fanartImage(fanart.getFanartImage())
                .commentCount(fanart.getComment())
                .likeCount(fanart.getLikeCount())
                .build();
    }

    // 1. 팬아트 메인 목록 조회
    // 1-1. 가장 최근에 등록된 팬아트 7개 조회
    public List<FanartListResponseDto> getLatestSevenFanarts(int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Fanart> fanartPage = fanartRepository.findAllByDeleted("N", pageable);

        return fanartPage.getContent().stream()
                .map(this::toFanartListResponseDto)
                .toList();
    }

    // 웹툰별 팬아트 목록 조회
    public List<FanartListResponseDto> getFanartByWebtoon(Integer webtoonId, int page, int pageSize, String orderBy) {
        // 웹툰 조회
        webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // Pageable 객체 생성 (최신순 정렬 적용)
        Pageable pageable = PageRequest.of(page -1, pageSize, getSort(orderBy));

        // 웹툰에 속한 팬아트 목록 조회
        Page<Fanart> fanarts = fanartRepository.findAllByWebtoonIdAndDeleted(webtoonId, "N", pageable);

        // DTO 생성
        return fanarts.getContent().stream()
                .map(this::toFanartListResponseDto)
                .toList();
    }

    // 팬아트 등록
    public FanartResponseDto createFanart(Integer userId, FanartRequestDto fanartRequestDto, MultipartFile fanartImage) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(fanartRequestDto.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanartRequestDto.getWebtoonId()));

        // 2차 창작 비허용
        if ("N".equals(webtoon.getAdaptable())) {
            throw new IllegalArgumentException("팬아트 작성이 불가능한 웹툰입니다.");
        }

        // 등록한 사용자 조회 (닉네임 가져오기)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserIdNotFoundException(userId));

        // 원작자는 팬아트 등록 불가
        if (user.getId().equals(webtoon.getUserId())) {
            throw new IllegalArgumentException("웹툰 원작자는 팬아트 등록이 불가능합니다.");
        }

        // 팬아트 엔티티 생성
        Fanart fanart = Fanart.builder()
                .userId(userId)
                .webtoonId(fanartRequestDto.getWebtoonId())
                .fanartName(fanartRequestDto.getFanartName())
                .description(fanartRequestDto.getDescription())
                .build();

        // 팬아트 저장
        Fanart savedFanart = fanartRepository.save(fanart);

        // 팬아트 이미지 저장
        String fanartImageUrl = uploadFanartImage(savedFanart.getFanartId(), fanartImage);
        savedFanart.setFanartImage(fanartImageUrl);
        fanartRepository.save(savedFanart);

        // 팬아트 생성 알림
        noticeService.addSecondaryCreateNotice(webtoon, fanart, user);

        return toFanartResponseDto(fanart, user, webtoon);
    }

    // 팬아트 상세 조회
    public FanartResponseDto getFanartDetail(Integer fanartId) {
        // 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(fanart.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanart.getWebtoonId()));

        // 유저 조회
        User user = userRepository.findById(fanart.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(fanart.getUserId()));

        // 팬아트 dto 반환
        return toFanartResponseDto(fanart, user, webtoon);
    }

    // 내 팬아트 목록 조회
    public List<FanartListResponseDto> getMyFanartList(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Fanart> fanartPage = fanartRepository.findByUserIdAndDeleted(userId, "N", pageable);

        return fanartPage.getContent().stream()
                .map(this::toFanartListResponseDto)
                .toList();
    }

    // 팬아트 수정
    public FanartResponseDto updateFanart(Integer userId, Integer fanartId, FanartRequestDto fanartRequestDto, MultipartFile fanartImage) {
        // 기존 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        // 수정 권한 없음
        if(!fanart.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("팬아트 수정 권한이 없습니다");
        }

        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(fanart.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanart.getWebtoonId()));

        // 이미지 업데이트
        if (fanartImage != null && !fanartImage.isEmpty()) {
            s3Service.deleteFile(fanart.getFanartImage());
            String fanartImageUrl = uploadFanartImage(fanart.getFanartId(), fanartImage);
            fanart.setFanartImage(fanartImageUrl);
        }

        // 팬아트 정보 업데이트
        if (fanartRequestDto != null) {
            fanart.setFanartName(fanartRequestDto.getFanartName());
            fanart.setDescription(fanartRequestDto.getDescription());
        }

        // 저장
        Fanart savedFanart = fanartRepository.save(fanart);

        User user = userRepository.findById(savedFanart.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(savedFanart.getUserId()));

        // 응답 DTO 생성
        return toFanartResponseDto(savedFanart, user, webtoon);
    }

    // 팬아트 삭제
    public void deleteFanart(Integer fanartId, Integer userId) {
        // 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        // 이미 삭제된 팬아트라면 예외 발생
        if ("Y".equalsIgnoreCase(fanart.getDeleted())) {
            throw new FanartNotFoundException(fanartId);
        }

        // 삭제 권한 없음
        if(!fanart.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("팬아트 삭제 권한이 없습니다");
        }

        // 소프트 삭제
        fanart.setDeleted("Y");
        fanartRepository.save(fanart);
    }

    // 팬아트 검색
    public SearchResponseDto<FanartListResponseDto> searchFanarts(int page, int pageSize, String keyword) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));

        // 키워드에 대해 제목이나 설명이 포함되는 조건을 specification으로 구성
        Specification<Fanart> spec = Specification.where(FanartSpecification.fanartNameContains(keyword))
                .or(FanartSpecification.descriptionContains(keyword))
                .and((root, query, cb) ->cb.equal(root.get("deleted"), "N"));

        // 검색 결과를 페이징 처리하여 조회하고 결과 리스트 반환
        Page<Fanart> resultPage = fanartRepository.findAll(spec, pageable);

        return SearchResponseDto.<FanartListResponseDto>builder()
                .type(SearchType.FANART.getValue())
                .totalCount(resultPage.getTotalElements())
                .searchResult(resultPage.getContent().stream()
                        .map(this::toFanartListResponseDto)
                        .toList())
                .build();
    }

    // 좋아요 증가
    @Transactional
    public void likeFanart(Integer userId, Integer fanartId) {
        // 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        FanartPreference fanartPreference = fanartPreferenceRepository.findByFanartIdAndUserId(fanartId, userId)
                .orElse(null);

        if (fanartPreference == null) {
            // 좋아요 기록이 없으면 새로 생성하여 저장
            fanartPreference = FanartPreference.builder()
                    .fanartId(fanartId)
                    .userId(userId)
                    .liked("Y")
                    .build();
            fanartPreferenceRepository.save(fanartPreference);
            // 팬아트 좋아요 개수 증가
            int currentLikeCount = fanart.getLikeCount() != null ? fanart.getLikeCount() : 0;
            fanart.setLikeCount(currentLikeCount + 1);
            fanartRepository.save(fanart);
        } else {
            // 이미 좋아요한 경우
            throw new DuplicatedException("이미 좋아요한 팬아트입니다.");
        }
    }

    // 좋아요 취소
    @Transactional
    public void unlikeFanart(Integer userId, Integer fanartId) {
        // 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        // 좋아요 기록 조회
        FanartPreference fanartPreference = fanartPreferenceRepository.findByFanartIdAndUserId(fanartId, userId)
                .orElseThrow(() -> new FanartPreferenceNotFoundException(fanartId, userId));

        // 좋아요 기록 삭제
        fanartPreferenceRepository.delete(fanartPreference);

        //팬아트 좋아요 개수 감소
        int currentLikeCount = fanart.getLikeCount() != null ? fanart.getLikeCount() : 0;
        if (currentLikeCount > 0) {
            fanart.setLikeCount(fanart.getLikeCount() - 1);
            fanartRepository.save(fanart);
        }
    }

    private Sort getSort(String orderBy) {
        switch (orderBy) {
            case "oldest":
                return Sort.by(Sort.Direction.ASC, "createdAt");
            case "latest":
            default:
                return Sort.by(Sort.Direction.DESC, "createdAt");
        }
    }
}
