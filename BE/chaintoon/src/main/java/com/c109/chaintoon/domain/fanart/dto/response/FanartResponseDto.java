package com.c109.chaintoon.domain.fanart.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//팬아트 메인 dto
public class FanartResponseDto {
    private Integer fanartId;
    private Integer userId;
    private String nickname;
    private String profileImage;
    private Integer webtoonId;
    private String webtoonName;
    private String fanartName;
    private String fanartImage;
    private Integer commentCount;
    private Integer likeCount;
    private String hasLiked;
}
