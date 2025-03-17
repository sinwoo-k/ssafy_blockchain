package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "rating")
public class Rating {
    @EmbeddedId
    private RatingId id;

    @Column
    private Integer rating;

}
