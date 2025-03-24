package com.c109.chaintoon.common.socket.service;

import com.c109.chaintoon.common.socket.code.SocketType;
import com.c109.chaintoon.common.socket.dto.SocketMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SocketService {
    private final SimpMessagingTemplate messagingTemplate;

    // 새 알림이 생긴 사용자에게 WebSocket 메시지 전송
    public void sendNewNotice(Integer userId) {
        SocketMessage notification =
                new SocketMessage(SocketType.NEW_NOTICE.getValue(), "새 알림이 도착했습니다.");
        messagingTemplate.convertAndSend("/topic/user/" + userId, notification);
    }

    // 경매에 참여 중인 사용자에게 WebSocket 메시지 전송
    public void sendAuctionItemUpdated(Integer auctionItemId) {
        SocketMessage notification =
                new SocketMessage(SocketType.AUCTION_ITEM_UPDATED.getValue(), "경매장 아이템이 업데이트 되었습니다.");
        messagingTemplate.convertAndSend("/topic/auction/" + auctionItemId, notification);
    }
}
