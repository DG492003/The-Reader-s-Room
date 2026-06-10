package com.trr.readers_room_api.roles;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface roleRepository extends JpaRepository<roleEntity, Integer> {
    Optional<roleEntity> findByName(String roleStudent);
}
