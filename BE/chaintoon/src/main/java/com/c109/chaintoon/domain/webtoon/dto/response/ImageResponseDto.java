package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponseDto {
    private Integer imageId;
    private String imageUrl;
    private Integer fileSize;
}
