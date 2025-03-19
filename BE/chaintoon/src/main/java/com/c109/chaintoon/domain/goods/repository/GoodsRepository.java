package com.c109.chaintoon.domain.goods.repository;

import com.c109.chaintoon.domain.goods.entity.Goods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Integer> {

    // 웹툰 id별 굿즈 총개수 조회
    int countByWebtoonId(Integer webtoonId);

    // 특정 웹툰 ID에 해당하는 굿즈 목록을 페이징 처리하여 조회
    Page<Goods> findAllByWebtoonIdAndDeleted(Integer webtoonId, String deleted, Pageable pageable);
}
