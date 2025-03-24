package com.c109.chaintoon.common.socket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage {
    private String type; // 소켓 메시지 타입
    private String message; // 소켓 메시지 내용
}
