package com.c109.chaintoon.domain.fanart.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CollectionId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "fanart_preference")
public class FanartPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "liked_id")
    private Integer likedId;

    @Column(name = "fanart_id", nullable = false)
    private Integer fanartId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "liked", length = 1)
    private String liked;
}
