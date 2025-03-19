package com.c109.chaintoon.domain.user.repository;

import com.c109.chaintoon.domain.user.entity.Following;
import com.c109.chaintoon.domain.user.entity.FollowingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolllowingRepository extends JpaRepository<Following, FollowingId> {

    // 사용자(id)가 팔로우중인 사용자 목록 조회
    @Query("SELECT f.id.followerId FROM Following f WHERE f.id.followerId=:userId")
    List<Integer> findFollowingsById(@Param("userId") Integer id);

    // 사용자(id)를 팔로우중인 사용자 목록 조회
    @Query("SELECT f.id.followeeId FROM Following f WHERE f.id.followeeId=:userId")
    List<Integer> findFollowersById(@Param("userId") Integer id);

}
