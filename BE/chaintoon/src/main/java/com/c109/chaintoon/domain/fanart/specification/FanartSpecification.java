package com.c109.chaintoon.domain.fanart.specification;

import com.c109.chaintoon.domain.fanart.entity.Fanart;
import org.springframework.data.jpa.domain.Specification;

public class FanartSpecification {

    public static Specification<Fanart> fanartNameContains(String keyword) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("fanartName"), "%" + keyword + "%");
    }

    public static Specification<Fanart> descriptionContains(String keyword) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("description"), "%" + keyword + "%");
    }
}
