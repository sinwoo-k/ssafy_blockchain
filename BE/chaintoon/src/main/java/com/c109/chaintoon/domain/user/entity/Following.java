package com.c109.chaintoon.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "following")
public class Following {

    @EmbeddedId
    private FollowingId id;

}
