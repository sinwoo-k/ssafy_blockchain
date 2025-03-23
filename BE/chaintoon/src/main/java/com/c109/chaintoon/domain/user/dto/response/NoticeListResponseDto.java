package com.c109.chaintoon.domain.user.dto.response;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeListResponseDto {
    private Integer userId;
    private Long uncheckedNoticeCount;
    private List<NoticeResponseDto> noticeList = new ArrayList<>();
}
