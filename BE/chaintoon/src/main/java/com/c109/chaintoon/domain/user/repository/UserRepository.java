package com.c109.chaintoon.domain.user.repository;

import com.c109.chaintoon.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Page<User> findByNicknameIgnoreCaseContaining(String nickname, Pageable pageable);

    Page<User> findByIdIn(Collection<Integer> userIds, Pageable pageable);
}
