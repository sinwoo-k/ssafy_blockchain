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
public class TagId {
    private Integer webtoonId;
    private String tag;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TagId tagId = (TagId) o;
        return Objects.equals(webtoonId, tagId.webtoonId) && Objects.equals(tag, tagId.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(webtoonId, tag);
    }
}
