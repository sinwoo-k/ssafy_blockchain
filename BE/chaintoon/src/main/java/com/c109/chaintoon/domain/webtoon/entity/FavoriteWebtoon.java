package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteWebtoon {

    @EmbeddedId
    private FavoriteWebtoonId id;

}
