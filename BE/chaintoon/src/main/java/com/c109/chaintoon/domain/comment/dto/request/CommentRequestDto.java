package com.c109.chaintoon.domain.comment.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequestDto {
    private Integer commentId;
    private Integer userId;
    private Integer usageId;
    private String usageType;
    private Integer parentId;
    private String content;
}
