package com.trr.readers_room_api.book;

import com.trr.readers_room_api.file.fileUtils;
import com.trr.readers_room_api.history.bookTransHistoryEntity;
import org.springframework.stereotype.Service;

@Service
public class bookMapper {

    public bookEntity toBook(bookRequest request) {
        return bookEntity.builder()
                .id(request.id())
                .title(request.title())
                .isbn(request.isbn())
                .authorName(request.authorName())
                .synopsis(request.synopsis())
                .archived(false)
                .shareable(request.shareable())
                .build();
    }

    public bookResponse toBookResponse(bookEntity book) {
        return bookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .authorName(book.getAuthorName())
                .isbn(book.getIsbn())
                .synopsis(book.getSynopsis())
                .rate(book.getRate())
                .archived(book.isArchived())
                .shareable(book.isShareable())
                .owner(book.getOwner().getFullName())
                .cover(fileUtils.readFileFromLocation(book.getBookCover()))
                .build();
    }

    public borrowedBookResponse toBorrowedBookResponse(bookTransHistoryEntity history) {
        return borrowedBookResponse.builder()
                .id(history.getBook().getId())
                .title(history.getBook().getTitle())
                .authorName(history.getBook().getAuthorName())
                .isbn(history.getBook().getIsbn())
                .rate(history.getBook().getRate())
                .returned(history.isReturned())
                .returnApproved(history.isReturnedApproved())
                .build();
    }
}

