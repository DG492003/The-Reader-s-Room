package com.trr.readers_room_api.feedback;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface feedbackRepository extends JpaRepository<feedbackEntity, Integer> {

    @Query("""
                        SELECT f
                        FROM feedbackEntity f
                        WHERE f.book.id = :bookId
            """)
    Page<feedbackEntity> findAllByBookId(@Param("bookId") Integer bookId, Pageable pageable);
}
