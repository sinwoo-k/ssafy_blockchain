package com.c109.chaintoon.domain.webtoon.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ImageRequestDto {
    private Integer imageId; // 기존 이미지 ID
    private MultipartFile newImage; // 새로운 이미지 파일
}