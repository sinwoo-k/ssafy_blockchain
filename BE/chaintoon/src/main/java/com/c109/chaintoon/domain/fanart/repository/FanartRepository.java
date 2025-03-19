package com.c109.chaintoon.domain.fanart.repository;

import com.c109.chaintoon.domain.fanart.entity.Fanart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FanartRepository extends JpaRepository<Fanart, Integer> {

    //웹툰 아이디별로 조회
    Page<Fanart> findByWebtoonId(Integer webtoonId, Pageable pageable);

    //userId로 팬아트를 페이징하여 조회
    Page<Fanart> findByUserId(Integer userId, Pageable pageable);

    Page<Fanart> findByUserIdAndDeleted(Integer userId, String deleted, Pageable pageable);
}
