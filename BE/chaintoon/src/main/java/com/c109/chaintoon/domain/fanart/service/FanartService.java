package com.c109.chaintoon.domain.fanart.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.domain.fanart.dto.request.FanartRequestDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartDetailResponseDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartResponseDto;
import com.c109.chaintoon.domain.fanart.dto.response.WebtoonFanartResponseDto;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.c109.chaintoon.domain.fanart.exception.FanartNotFoundException;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.fanart.repository.FanartRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FanartService {

    private final FanartRepository fanartRepository;
    private final WebtoonRepository webtoonRepository;
    private final UserRepository userRepository;

    // 1. 팬아트 메인 목록 조회
    // 1-1. 가장 최근에 등록된 팬아트 7개 조회
    public List<FanartResponseDto> getLatestSevenFanarts(int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Fanart> fanartPage = fanartRepository.findAll(pageable);

        List<FanartResponseDto> dtos = new ArrayList<>();
        for(Fanart fanart : fanartPage.getContent()) {
            FanartResponseDto dto = FanartResponseDto.builder()
                    .fanartId(fanart.getFanartId())
                    .userId(fanart.getUserId())
                    .webtoonId(fanart.getWebtoonId())
                    .fanartImage(fanart.getFanartImage())
                    .fanartName(fanart.getFanartName())
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }

    //1-2. 웹툰별 팬아트 목록 조회
    public List<WebtoonListResponseDto> getWebtoonGrid(int page, String orderBy) {
        int pageSize = 8;
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Webtoon> webtoonPage = webtoonRepository.findAll(pageable);
        List<WebtoonListResponseDto> dtos = new ArrayList<>();
        for (Webtoon webtoon : webtoonPage.getContent()) {
            // TODO: 유저 구현 시 변경
            String writer = null;
            double rating = webtoon.getRatingCount() == 0 ? 0.0 :
                    Math.round((webtoon.getRatingSum() / (double) webtoon.getRatingCount()) * 100) / 100.0;

            WebtoonListResponseDto dto = WebtoonListResponseDto.builder()
                    .webtoonId(webtoon.getWebtoonId())
                    .userId(webtoon.getUserId())
                    .writer(writer)
                    .webtoonName(webtoon.getWebtoonName())
                    .garoThumbnail(webtoon.getGaroThumbnail())
                    .seroThumbnail(webtoon.getSeroThumbnail())
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }

    // 웹툰별 팬아트 목록 조회
    public WebtoonFanartResponseDto getFanartByWebtoon(Integer webtoonId, int page, int pageSize, String orderBy) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // Todo : 유저 구현 시 변경
        String writer = null;

        // Pageable 객체 생성 (최신순 정렬 적용)
        Pageable pageable = PageRequest.of(page -1, pageSize, getSort(orderBy));

        // 웹툰에 속한 팬아트 목록 조회
        Page<Fanart> fanarts = fanartRepository.findByWebtoonId(webtoonId, pageable);

        // 팬아트 이미지 경로만 추출
        List<String> fanartImages = fanarts.stream()
                .map(Fanart::getFanartImage)
                .collect(Collectors.toList());

        // DTO 생성
        return WebtoonFanartResponseDto.builder()
                .webtoonId(webtoon.getWebtoonId())
                .webtoonName(webtoon.getWebtoonName())
                .writer(writer)
                .genre(webtoon.getGenre())
                .summary(webtoon.getSummary())
                .garoThumbnail(webtoon.getGaroThumbnail())
                .seroThumbnail(webtoon.getSeroThumbnail())
                .webtoonFanartCount((int) fanarts.getTotalElements())
                .fanartImages(fanartImages)
                .build();
    }

    // 팬아트 등록
    public FanartDetailResponseDto createFanart(FanartRequestDto fanartRequestDto, MultipartFile fanartImage) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(fanartRequestDto.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanartRequestDto.getWebtoonId()));

        // 2. 등록한 사용자 조회 (닉네임 가져오기)
        User user = userRepository.findById(fanartRequestDto.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(fanartRequestDto.getUserId()));

        // TODO : 이미지 업로드
        String fanartImageUrl = fanartRequestDto.getFanartImage(); // 기본값 (예: 미리 입력된 URL)
        if (fanartImage != null && !fanartImage.isEmpty()) {
            // S3에 파일 업로드 후 URL 반환
            fanartImageUrl = null;
        }

        // 팬아트 엔티티 생성
        Fanart fanart = Fanart.builder()
                .userId(fanartRequestDto.getUserId())
                .webtoonId(fanartRequestDto.getWebtoonId())
                .fanartName(fanartRequestDto.getFanartName())
                .fanartImage(fanartImageUrl)
                .description(fanartRequestDto.getDescription())
                .build();

        // 팬아트 저장
        Fanart savedFanart = fanartRepository.save(fanart);

        return FanartDetailResponseDto.builder()
                .fanartId(savedFanart.getFanartId())
                .userId(savedFanart.getUserId())
                .webtoonId(savedFanart.getWebtoonId())
                .fanartImage(savedFanart.getFanartImage())
                .fanartName(savedFanart.getFanartName())
                .webtoonName(webtoon.getWebtoonName())
                .userNickname(user.getNickname())
                .description(savedFanart.getDescription())
                .build();
    }

    // 팬아트 상세 조회
    public FanartDetailResponseDto getFanartDetail(Integer fanartId) {
        // 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(fanart.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanart.getWebtoonId()));

        // 사용자 닉네임 (User 연동 시)
        // String userNickname = userRepository.findById(fanart.getUserId())
        //         .map(User::getNickname)
        //         .orElse(null);

        // 현재는 userNickname = null 로 처리
        String userNickname = null;

        return FanartDetailResponseDto.builder()
                .fanartId(fanart.getFanartId())
                .userId(fanart.getUserId())
                .webtoonId(fanart.getWebtoonId())
                .fanartImage(fanart.getFanartImage())
                .fanartName(fanart.getFanartName())
                .webtoonName(webtoon.getWebtoonName())
                .userNickname(userNickname)
                .description(fanart.getDescription())
                .build();
    }

    // 내 팬아트 목록 조회
    public List<FanartResponseDto> getMyFanartList(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<Fanart> fanartPage = fanartRepository.findByUserIdAndDeleted(userId, "N", pageable);

        List<FanartResponseDto> dtos = new ArrayList<>();
        for(Fanart fanart : fanartPage.getContent()) {
            Webtoon webtoon = webtoonRepository.findById(fanart.getWebtoonId()).orElse(null);
            String webtoonName = (webtoon != null) ? webtoon.getWebtoonName() : null;
            String garoThumbnail = (webtoon != null) ? webtoon.getGaroThumbnail() : null;
            String seroThumbnail = (webtoon != null) ? webtoon.getSeroThumbnail() : null;

            FanartResponseDto dto = FanartResponseDto.builder()
                    .fanartId(fanart.getFanartId())
                    .userId(fanart.getUserId())
                    .webtoonId(fanart.getWebtoonId())
                    .fanartImage(fanart.getFanartImage())
                    .fanartName(fanart.getFanartName())
                    .garoThumbnail(garoThumbnail)
                    .seroThumbnail(seroThumbnail)
                    .webtoonName(webtoonName)
                    .build();

            dtos.add(dto);
        }
        return dtos;
    }

    // 팬아트 수정
    public FanartDetailResponseDto updateFanart(FanartRequestDto fanartRequestDto, MultipartFile fanartImage) {
        // 기존 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartRequestDto.getFanartId())
                .orElseThrow(() -> new FanartNotFoundException(fanartRequestDto.getFanartId()));

        // 수정 권한 없음
        if(!fanart.getUserId().equals(fanartRequestDto.getUserId())) {
            throw new UnauthorizedAccessException("팬아트 수정 권한이 없습니다");
        }

        Webtoon webtoon = webtoonRepository.findById(fanart.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanart.getWebtoonId()));

        // 이미지 업데이트 (TODO: 실제 업로드 로직 구현)
        if (fanartImage != null && !fanartImage.isEmpty()) {
            // 실제 업로드 로직 구현 후 반환받은 URL 사용
            String updatedImageUrl = null; // 임시 처리
            fanart.setFanartImage(updatedImageUrl);
        } else if (fanartRequestDto.getFanartImage() != null) {
            // 이미지 파일 없이 URL만 변경하는 경우
            fanart.setFanartImage(fanartRequestDto.getFanartImage());
        }

        // 팬아트 정보 업데이트
        if (fanartRequestDto.getFanartName() != null) {
            fanart.setFanartName(fanartRequestDto.getFanartName());
        }
        if (fanartRequestDto.getDescription() != null) {
            fanart.setDescription(fanartRequestDto.getDescription());
        }

        // 저장
        Fanart savedFanart = fanartRepository.save(fanart);

        User user = userRepository.findById(savedFanart.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(savedFanart.getUserId()));

        // 응답 DTO 생성
        return FanartDetailResponseDto.builder()
                .fanartId(savedFanart.getFanartId())
                .userId(savedFanart.getUserId())
                .webtoonId(savedFanart.getWebtoonId())
                .fanartImage(savedFanart.getFanartImage())
                .fanartName(savedFanart.getFanartName())
                .webtoonName(webtoon.getWebtoonName())
                .userNickname(user.getNickname())
                .description(savedFanart.getDescription())
                .build();
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

    private Sort getSort(String orderBy) {
        switch (orderBy) {
            case "latest":
                return Sort.by(Sort.Direction.DESC, "createdAt");
            case "oldest":
                return Sort.by(Sort.Direction.ASC, "createdAt");
            default:
                return Sort.by(Sort.Direction.DESC, "createdAt");
        }
    }
}
