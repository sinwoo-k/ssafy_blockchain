package com.c109.chaintoon.domain.webtoon.repository;

import com.c109.chaintoon.domain.webtoon.entity.Rating;
import com.c109.chaintoon.domain.webtoon.entity.RatingId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, RatingId> {

}
