package com.c109.chaintoon.domain.goods.specification;

import com.c109.chaintoon.domain.goods.entity.Goods;
import org.springframework.data.jpa.domain.Specification;

public class GoodsSpecification {

    public static Specification<Goods> goodsNameContains(String keyword) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("goodsName"), "%" + keyword + "%");
    }
}
