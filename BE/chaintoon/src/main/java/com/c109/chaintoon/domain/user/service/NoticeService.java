package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.common.socket.service.SocketService;
import com.c109.chaintoon.domain.user.code.NoticeType;
import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import com.c109.chaintoon.domain.user.dto.response.NoticeListResponseDto;
import com.c109.chaintoon.domain.user.dto.response.NoticeResponseDto;
import com.c109.chaintoon.domain.user.entity.Notice;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.NoticeNotFoundException;
import com.c109.chaintoon.domain.user.repository.NoticeRepository;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;
    private final ObjectMapper objectMapper;
    private final SocketService socketService;

    // JSON 문자열을 JsonNode 변환하는 메서드
    private JsonNode convertStringToJsonNode(String jsonString) {
        try {
            return objectMapper.readTree(jsonString);
        } catch (Exception e) {
            throw new ServerException("JSON 변환이 실패했습니다.");
        }
    }

    @Transactional(readOnly = true)
    public NoticeListResponseDto getNoticeList(Integer userId, int page, int pageSize) {
        // 페이징 처리
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize);

        // 사용자의 알림 목록 조회
        Page<Notice> noticePage = noticeRepository.findByUserIdAndDeleted(userId, "N", pageRequest);

        // 조회된 알림 목록 Dto 변환
        List<NoticeResponseDto> noticeResponseDtos = noticePage.getContent().stream()
                .map(notice -> NoticeResponseDto.builder()
                        .noticeId(notice.getNoticeId())
                        .userId(notice.getUserId())
                        .type(notice.getType())
                        .checked(notice.getChecked())
                        .metadata(convertStringToJsonNode(notice.getMetadata()))
                        .build())
                .collect(Collectors.toList());

        // 미확인 알림 개수 조회
        Long uncheckedNoticeCount = noticeRepository
                .countByUserIdAndCheckedAndDeleted(userId, "N", "N", Limit.of(100));

        // NoticeListResponseDto 생성 및 반환
        return NoticeListResponseDto.builder()
                .userId(userId)
                .uncheckedNoticeCount(uncheckedNoticeCount)
                .noticeList(noticeResponseDtos)
                .build();
    }

    @Transactional
    public void readNotice(Integer userId, Integer noticeId) {
        // 알림 조회
        Notice notice = noticeRepository.findByNoticeIdAndDeleted(noticeId, "N")
                .orElseThrow(() -> new NoticeNotFoundException(noticeId));

        // 알림 조회 권한 확인
        if (!userId.equals(notice.getUserId())) {
            throw new UnauthorizedAccessException("알림 조회 권한이 없습니다.");
        }

        // 알림 읽음 처리
        notice.setChecked("Y");
        noticeRepository.save(notice);
    }

    @Transactional
    public void deletedNotice(Integer userId, Integer noticeId) {
        // 알림 조회
        Notice notice = noticeRepository.findByNoticeIdAndDeleted(noticeId, "N")
                .orElseThrow(() -> new NoticeNotFoundException(noticeId));

        // 알림 삭제 권한 확인
        if (!userId.equals(notice.getUserId())) {
            throw new UnauthorizedAccessException("알림 삭제 권한이 없습니다.");
        }

        // 알림 삭제
        notice.setDeleted("Y");
        noticeRepository.save(notice);
    }

    // 팬아트 생성 알림
    @Transactional
    public void addSecondaryCreateNotice(Webtoon webtoon, Fanart fanart, User secondWriter) {
        try {
            // metadata 생성
            Map<String, Object> metadata = Map.of(
                    "webtoonId", webtoon.getWebtoonId(),
                    "fanartId", fanart.getFanartId(),
                    "secondWriterId", secondWriter.getId()
            );

            // JSON 문자열 변환
            String metadataJson = objectMapper.writeValueAsString(metadata);

            Notice notice = Notice.builder()
                    .userId(webtoon.getUserId()) // 원작자에게 알림 전송
                    .type(NoticeType.SECONDARY_CREATE.getValue())
                    .metadata(metadataJson)
                    .build();

            noticeRepository.save(notice);
        }
        catch (JsonProcessingException e) {
            throw new ServerException("알림 생성이 실패했습니다.");
        }

        // 소켓 메시지 전송
        socketService.sendNewNotice(webtoon.getUserId());
    }

    // TODO: 소연 - 경매장 기능 구현 후 알림 생성
    public void addOverbidNotice(AuctionItem auctionItem) {
        try {
            // metadata 생성
            Map<String, Object> metadata = Map.of(
                    "nftId", auctionItem.getNftId(),
                    "previousBiddingPrice", auctionItem.getBiddingPrice()
            );

            // JSON 문자열 변환
            String metadataJson = objectMapper.writeValueAsString(metadata);

            Notice notice = Notice.builder()
                    .userId(auctionItem.getBidderId()) // 기존 입찰자에게 알림 전송
                    .type(NoticeType.OVERBID.getValue())
                    .metadata(metadataJson)
                    .build();

            noticeRepository.save(notice);
        }
        catch (JsonProcessingException e) {
            throw new ServerException("알림 생성이 실패했습니다.");
        }

        // 소켓 메시지 전송
        socketService.sendNewNotice(auctionItem.getBidderId());
    }

    // 계약 체결 시 호출
    public void addActionCompleteNotice(TradingHistory tradingHistory, Webtoon webtoon) {
        addNftPurchaseNotice(tradingHistory);
        addNftSoldNotice(tradingHistory);
        addSecondaryCreationNftSoldNotice(tradingHistory, webtoon); // 원작자에게 알림
    }

    // 구매자에게 구매 알림 TODO: 수익 구조 결정 후 값 저장
    private void addNftPurchaseNotice(TradingHistory tradingHistory) {
        try {
            // metadata 생성
            Map<String, Object> metadata = Map.of(
                    "nftId", tradingHistory.getNftId(),
                    "tradingValue", tradingHistory.getTradingValue()
            );

            // JSON 문자열 변환
            String metadataJson = objectMapper.writeValueAsString(metadata);

            Notice notice = Notice.builder()
                    .userId(tradingHistory.getBuyerId()) // 구매자에게 알림 전송
                    .type(NoticeType.NFT_PURCHASE.getValue())
                    .metadata(metadataJson)
                    .build();

            noticeRepository.save(notice);
        }
        catch (JsonProcessingException e) {
            throw new ServerException("알림 생성이 실패했습니다.");
        }

        // 소켓 메시지 전송
        socketService.sendNewNotice(tradingHistory.getBuyerId());
    }

    // 판매자에게 판매 알림
    private void addNftSoldNotice(TradingHistory tradingHistory) {
        try {
            // metadata 생성
            Map<String, Object> metadata = Map.of(
                    "nftId", tradingHistory.getNftId(),
                    "tradingValue", tradingHistory.getTradingValue(),
                    "revenue", 0.0D
            );

            // JSON 문자열 변환
            String metadataJson = objectMapper.writeValueAsString(metadata);

            Notice notice = Notice.builder()
                    .userId(tradingHistory.getSellerId()) // 판매자에게 알림 전송
                    .type(NoticeType.NFT_PURCHASE.getValue())
                    .metadata(metadataJson)
                    .build();

            noticeRepository.save(notice);
        }
        catch (JsonProcessingException e) {
            throw new ServerException("알림 생성이 실패했습니다.");
        }

        // 소켓 메시지 전송
        socketService.sendNewNotice(tradingHistory.getSellerId());
    }

    // 2차 창작물 판매 시 원작자에게 알림
    public void addSecondaryCreationNftSoldNotice(TradingHistory tradingHistory, Webtoon webtoon) {
        try {
            // metadata 생성
            Map<String, Object> metadata = Map.of(
                    "nftId", tradingHistory.getNftId(),
                    "tradingValue", tradingHistory.getTradingValue(),
                    "copyrightFee", 0.0D
            );

            // JSON 문자열 변환
            String metadataJson = objectMapper.writeValueAsString(metadata);

            Notice notice = Notice.builder()
                    .userId(webtoon.getUserId()) // 원작자에게 알림 전송
                    .type(NoticeType.NFT_PURCHASE.getValue())
                    .metadata(metadataJson)
                    .build();

            noticeRepository.save(notice);
        }
        catch (JsonProcessingException e) {
            throw new ServerException("알림 생성이 실패했습니다.");
        }

        // 소켓 메시지 전송
        socketService.sendNewNotice(webtoon.getUserId());
    }

    // TODO: 도현 - NFT 발행 기능 구현 후, 2차 창작물일 경우 알림 생성
    public void addSecondaryCreationNftMintNotice() {

    }
}
