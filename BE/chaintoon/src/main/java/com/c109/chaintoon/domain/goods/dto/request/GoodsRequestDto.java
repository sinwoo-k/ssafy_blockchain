package com.c109.chaintoon.domain.goods.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoodsRequestDto {
    @Positive(message = "웹툰 ID는 음수일 수 없습니다.")
    private Integer webtoonId;

    @NotBlank(message = "굿즈 이름을 입력하세요.")
    private String goodsName;

    @NotBlank(message = "굿즈 설명을 입력하세요.")
    private String description;
}
