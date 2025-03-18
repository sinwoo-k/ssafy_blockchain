package com.c109.chaintoon.domain.webtoon.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.domain.webtoon.dto.request.FanartRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.FanartDetailResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.FanartResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonFanartResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.Fanart;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.c109.chaintoon.domain.webtoon.exception.FanartNotFoundException;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.FanartRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
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
public class FanartService {

    private final FanartRepository fanartRepository;
    private final WebtoonRepository webtoonRepository;

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
    public WebtoonFanartResponseDto createFanart(FanartRequestDto fanartRequestDto) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(fanartRequestDto.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(fanartRequestDto.getWebtoonId()));

        // 팬아트 엔티티 생성
        Fanart fanart = Fanart.builder()
                .userId(fanartRequestDto.getUserId())
                .webtoonId(fanartRequestDto.getWebtoonId())
                .fanartName(fanartRequestDto.getFanartName())
                .fanartImage(fanartRequestDto.getFanartImage())
                .description(fanartRequestDto.getDescription())
                .build();

        // 팬아트 저장
        Fanart savedFanart = fanartRepository.save(fanart);

        // 기본 페이징 파라미터 설정
        int defaultPage = 1;
        int defaultPageSize = 10;
        String orderBy = "latest";
        Pageable pageable = PageRequest.of(defaultPage - 1, defaultPageSize, getSort(orderBy));

        // 해당 웹툰에 속한 모든 팬아트 조회
        Page<Fanart> fanarts = fanartRepository.findByWebtoonId(fanartRequestDto.getWebtoonId(), pageable);

        // 팬아트 이미지 리스트 추출
        List<String> fanartImages = fanarts.stream()
                .map(Fanart::getFanartImage)
                .collect(Collectors.toList());

        // TODO : 작성자 정보
        String writer = null;

        return WebtoonFanartResponseDto.builder()
                .fanartId(savedFanart.getFanartId())
                .userId(savedFanart.getUserId())
                .webtoonId(savedFanart.getWebtoonId())
                .garoThumbnail(webtoon.getGaroThumbnail())
                .seroThumbnail(webtoon.getSeroThumbnail())
                .webtoonName(webtoon.getWebtoonName())
                .writer(writer)
                .genre(webtoon.getGenre())
                .summary(webtoon.getSummary())
                .webtoonFanartCount((int) fanarts.getTotalElements())
                .fanartImages(fanartImages)
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
    public FanartResponseDto updateFanart(FanartRequestDto fanartRequestDto, MultipartFile fanartImage) {
        // 기존 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartRequestDto.getFanartId())
                .orElseThrow(() -> new FanartNotFoundException(fanartRequestDto.getFanartId()));

        // 수정 권한 없음
        if(!fanart.getUserId().equals(fanartRequestDto.getUserId())) {
            throw new UnauthorizedAccessException("팬아트 수정 권한이 없습니다");
        }

        // 이미지 업데이트
        // TODO : 이미지 추가
        if(fanartImage != null && !fanartImage.isEmpty()) {
            String fanartImageUrl = null;
            fanart.setFanartImage(fanartImageUrl);
        }

        // 팬아트 정보 업데이트
        if(fanartRequestDto != null){
            fanart.setFanartName(fanartRequestDto.getFanartName());
            fanart.setDescription(fanartRequestDto.getDescription());
        }

        // 저장
        Fanart savedFanart = fanartRepository.save(fanart);

        // 응답 DTO 생성
        return FanartResponseDto.builder()
                .fanartImage(savedFanart.getFanartImage())
                .fanartName(savedFanart.getFanartName())
                .description(savedFanart.getDescription())
                .build();
    }

    // 팬아트 삭제
    public List<FanartResponseDto> deleteFanart(Integer fanartId, Integer userId, int page, int pageSize, String orderBy) {
        // 팬아트 조회
        Fanart fanart = fanartRepository.findById(fanartId)
                .orElseThrow(() -> new FanartNotFoundException(fanartId));

        // 삭제 권한 없음
        if(!fanart.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("팬아트 삭제 권한이 없습니다");
        }

        // 소프트 삭제
        fanart.setDeleted("Y");
        fanartRepository.save(fanart);

        return getMyFanartList(userId, page, pageSize, orderBy);
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
