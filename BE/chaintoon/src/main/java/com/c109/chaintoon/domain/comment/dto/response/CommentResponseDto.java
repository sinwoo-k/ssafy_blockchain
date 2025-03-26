package com.c109.chaintoon.domain.comment.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDto {
    private Integer commentId;
    private Integer userId;
    private String nickname;
    private String profileImage;
    private Integer usageId;
    private String type;
    private Integer parentId;
    private String content;
    private String updateDate; // 2025-03-17
    private String updateTime; // 10:09:05
    private Long replyCount;
    private Long likeCount;
    private Long hateCount;
}
