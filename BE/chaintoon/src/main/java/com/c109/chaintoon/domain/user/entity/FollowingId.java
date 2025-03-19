package com.c109.chaintoon.domain.user.entity;

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
public class FollowingId {
    private Integer followerId;
    private Integer followeeId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FollowingId)) return false;
        FollowingId that = (FollowingId) o;
        return Objects.equals(followerId, that.followerId) &&
                Objects.equals(followeeId, that.followeeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(followerId, followeeId);
    }
}
