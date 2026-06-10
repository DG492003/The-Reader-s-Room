package com.trr.readers_room_api.tokens;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface tokenRepository extends JpaRepository<tokenEntity, Integer> {

    Optional<tokenEntity> findByToken(String token);
}
