package com.c109.chaintoon.domain.fanart.repository;

import com.c109.chaintoon.domain.fanart.entity.FanartPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FanartPreferenceRepository extends JpaRepository<FanartPreference, Integer> {
    Optional<FanartPreference> findByFanartIdAndUserId(Integer fanartId, Integer userId);
}
