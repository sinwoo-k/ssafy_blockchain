package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.Tag;
import com.c109.chaintoon.domain.webtoon.entity.TagId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, TagId> {
    List<Tag> findByTagId_WebtoonId(Integer tagIdWebtoonId);
}
