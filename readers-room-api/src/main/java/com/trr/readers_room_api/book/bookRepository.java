package com.trr.readers_room_api.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface bookRepository extends JpaRepository<bookEntity, Integer>, JpaSpecificationExecutor<bookEntity> {

    @Query("""
            SELECT b
             FROM bookEntity b
             WHERE b.archived = false
             AND b.shareable = true
             AND b.owner.id != :userId
            """)
    Page<bookEntity> findAllDisplayableBooks(Pageable pageable, Integer userId);

}
