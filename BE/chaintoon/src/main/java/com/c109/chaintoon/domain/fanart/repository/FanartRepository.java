package com.c109.chaintoon.domain.fanart.repository;

import com.c109.chaintoon.domain.fanart.entity.Fanart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FanartRepository extends JpaRepository<Fanart, Integer>, JpaSpecificationExecutor<Fanart> {

    Page<Fanart> findByUserIdAndDeleted(Integer userId, String deleted, Pageable pageable);


    Page<Fanart> findAllByWebtoonIdAndDeleted(Integer webtoonId, String deleted, Pageable pageable);

    @Modifying
    @Query("UPDATE Fanart f SET f.comment = f.comment + 1 WHERE f.fanartId = :fanartId")
    void incrementCommentCount(@Param("fanartId") Integer fanartId);

    @Modifying
    @Query("UPDATE Fanart f SET f.comment = f.comment - 1 WHERE f.fanartId = :fanartId")
    void decrementCommentCount(@Param("fanartId") Integer fanartId);

    boolean existsByWebtoonId(Integer webtoonId);
}
