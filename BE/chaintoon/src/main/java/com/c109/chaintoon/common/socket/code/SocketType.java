package com.c109.chaintoon.common.socket.code;

import lombok.Getter;

@Getter
public enum SocketType {
    NEW_NOTICE("새로운 알림 도착", "SOCKET_NEW_NOTICE"),
    AUCTION_ITEM_UPDATED("경매장 아이템 업데이트", "SOCKET_AUCTION_ITEM_UPDATED");

    private final String description;
    private final String value;

    SocketType(String description, String value) {
        this.description = description;
        this.value = value;
    }
}