package com.trr.readers_room_api.users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface userRepository extends JpaRepository<userEntity, Integer> {

    Optional<userEntity> findByEmail(String email);
}
