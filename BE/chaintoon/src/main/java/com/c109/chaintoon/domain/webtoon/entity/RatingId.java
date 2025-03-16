package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RatingId {
    private Integer episodeId;
    private Integer userId;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RatingId ratingId = (RatingId) o;
        return Objects.equals(episodeId, ratingId.episodeId) && Objects.equals(userId, ratingId.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(episodeId, userId);
    }
}
