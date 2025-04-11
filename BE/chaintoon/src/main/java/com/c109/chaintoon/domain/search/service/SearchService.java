package com.c109.chaintoon.domain.search.service;

import com.c109.chaintoon.domain.fanart.service.FanartService;
import com.c109.chaintoon.domain.goods.service.GoodsService;
import com.c109.chaintoon.domain.search.code.SearchType;
import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import com.c109.chaintoon.domain.search.dto.response.SearchResult;
import com.c109.chaintoon.domain.user.service.UserService;
import com.c109.chaintoon.domain.webtoon.service.WebtoonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class SearchService {


    private final WebtoonService webtoonService;
    private final GoodsService goodsService;
    private final FanartService fanartService;
    private final UserService userService;

    public SearchResponseDto<? extends SearchResult> search(String type, String keyword, int page, int pageSize) {
        if (type.equals(SearchType.WEBTOON.getValue())) {
            return webtoonService.searchWebtoon(page, pageSize, keyword);
        }
        else if (type.equals(SearchType.GOODS.getValue())) {
            return goodsService.searchGoods(page, pageSize, keyword);
        }
        else if (type.equals(SearchType.FANART.getValue())) {
            return fanartService.searchFanarts(page, pageSize, keyword);
        }
        else if (type.equals(SearchType.USER.getValue())) {
            return userService.searchByNickname(keyword, page, pageSize);
        }
        else {
            throw new IllegalArgumentException("검색 타입을 확인하세요.");
        }
    }

    public Map<String, SearchResponseDto<? extends SearchResult>> searchAll(String keyword, int pageSize) {
        Map<String, SearchResponseDto<? extends SearchResult>> resultMap = new HashMap<>();

        // 웹툰 검색
        resultMap.put(SearchType.WEBTOON.name(), webtoonService.searchWebtoon(1, pageSize, keyword));
        // 굿즈 검색
        resultMap.put(SearchType.GOODS.name(), goodsService.searchGoods(1, pageSize, keyword));
        // 팬아트 검색
        resultMap.put(SearchType.FANART.name(), fanartService.searchFanarts(1, pageSize, keyword));
        // 유저 검색
        resultMap.put(SearchType.USER.name(), userService.searchByNickname(keyword, 1, pageSize));

        return resultMap;
    }
}
