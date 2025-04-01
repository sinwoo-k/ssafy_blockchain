package com.c109.chaintoon.domain.user.dto.response;

import com.c109.chaintoon.domain.search.dto.response.SearchResult;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchUserResponseDto implements SearchResult {

    private Integer id;
    private String nickname;
    private String profileImage;
}
