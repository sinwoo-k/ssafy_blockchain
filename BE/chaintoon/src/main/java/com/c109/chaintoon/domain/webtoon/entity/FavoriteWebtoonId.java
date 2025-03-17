package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class FavoriteWebtoonId implements Serializable {
    private Integer userId;
    private Integer webtoonId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        FavoriteWebtoonId that = (FavoriteWebtoonId) o;

        if (!userId.equals(that.userId)) return false;
        return webtoonId.equals(that.webtoonId);
    }

    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + webtoonId.hashCode();
        return result;
    }
}