package com.c109.chaintoon.domain.goods.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goods_id")
    private Integer goodsId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "webtoon_id", nullable = false)
    private Integer webtoonId;

    @Column(name = "goods_name", length = 50)
    private String goodsName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "goods_image", length = 255)
    private String goodsImage;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (deleted == null) {deleted = "N";}
        if (createdAt == null) {createdAt = LocalDateTime.now();}
    }

}
