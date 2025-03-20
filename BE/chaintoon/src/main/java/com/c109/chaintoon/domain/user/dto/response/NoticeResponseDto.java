package com.c109.chaintoon.domain.user.dto.response;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeResponseDto {
    private Integer noticeId;
    private Integer userId;
    private String type;
    private String checked;
    private JsonNode metadata;
}
