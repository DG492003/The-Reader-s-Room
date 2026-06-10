package com.trr.readers_room_api.history;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface bookTransHistoryRepository extends JpaRepository<bookTransHistoryEntity, Integer> {

    @Query("""
            SELECT (COUNT(b) > 0)
            FROM bookTransHistoryEntity b
            WHERE b.user.id = :userId
            AND b.book.id = :bookId
            AND b.isReturnedApproved = false
            """)
    boolean isAlreadyBorrowedByUser(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    @Query("""
            SELECT (COUNT(b) > 0)
            FROM bookTransHistoryEntity b
            WHERE b.book.id = :bookId
            AND b.isReturnedApproved = false
            """)
    boolean isAlreadyBorrowed(@Param("bookId") Integer bookId);

    @Query("""
            SELECT t
            FROM bookTransHistoryEntity t
            WHERE t.user.id = :userId
            AND t.book.id = :bookId
            AND t.isReturned = false
            AND t.isReturnedApproved = false
            """)
    Optional<bookTransHistoryEntity> findByBookIdAndUserId(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    @Query("""
            SELECT t
            FROM bookTransHistoryEntity t
            WHERE t.book.createdBy = :userId
            AND t.book.id = :bookId
            AND t.isReturned = true
            AND t.isReturnedApproved = false
            """)
    Optional<bookTransHistoryEntity> findByBookIdAndOwnerId(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    @Query("""
            SELECT h
            FROM bookTransHistoryEntity h
            WHERE h.user.id = :userId
            """)
    Page<bookTransHistoryEntity> findAllBorrowedBooks(Pageable pageable, Integer userId);

    @Query("""
            SELECT h
            FROM bookTransHistoryEntity h
            WHERE h.book.owner.id = :userId
            """)
    Page<bookTransHistoryEntity> findAllReturnedBooks(Pageable pageable, Integer userId);
}
