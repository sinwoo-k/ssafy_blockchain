package com.c109.chaintoon.domain.goods.repository;

import com.c109.chaintoon.domain.goods.entity.Goods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Integer>, JpaSpecificationExecutor<Goods> {

    // 특정 웹툰 ID에 해당하는 굿즈 목록을 페이징 처리하여 조회
    Page<Goods> findAllByWebtoonIdAndDeleted(Integer webtoonId, String deleted, Pageable pageable);

    Optional<Goods> findByGoodsIdAndDeleted(Integer goodsId, String deleted);
}
