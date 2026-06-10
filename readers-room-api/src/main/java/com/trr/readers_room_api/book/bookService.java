package com.trr.readers_room_api.book;

import com.trr.readers_room_api.common.pageResponse;
import com.trr.readers_room_api.file.fileStorageService;
import com.trr.readers_room_api.handler.exception.OperationNotPermittedException;
import com.trr.readers_room_api.history.bookTransHistoryEntity;
import com.trr.readers_room_api.history.bookTransHistoryRepository;
import com.trr.readers_room_api.users.userEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

import static com.trr.readers_room_api.book.bookSpecification.withOwnerId;

@Service
@RequiredArgsConstructor
public class bookService {

    private final bookMapper bookMapper;
    private final bookRepository repo;
    private final bookTransHistoryRepository bookTransRepo;
    private final fileStorageService fileStorageService;

    public Integer save(bookRequest req, Authentication connectedUser) {
        userEntity user = (userEntity) connectedUser.getPrincipal();
        bookEntity book = bookMapper.toBook(req);
        book.setOwner(user);
        return repo.save(book).getId();
    }

    public bookResponse findById(Integer bookId) {
        return repo.findById(bookId).map(bookMapper::toBookResponse).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
    }

    public pageResponse<bookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        userEntity user = (userEntity) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<bookEntity> books = repo.findAllDisplayableBooks(pageable, user.getId());
        List<bookResponse> booksResponse = books.stream().map(bookMapper::toBookResponse).toList();
        return new pageResponse<>(booksResponse, books.getNumber(), books.getSize(), books.getTotalElements(), books.getTotalPages(), books.isFirst(), books.isLast());
    }

    public pageResponse<bookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
        userEntity user = (userEntity) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<bookEntity> books = repo.findAll(withOwnerId(user.getId()), pageable);
        List<bookResponse> booksResponse = books.stream().map(bookMapper::toBookResponse).toList();
        return new pageResponse<>(booksResponse, books.getNumber(), books.getSize(), books.getTotalElements(), books.getTotalPages(), books.isFirst(), books.isLast());
    }

    public pageResponse<borrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
        userEntity user = (userEntity) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<bookTransHistoryEntity> allBorrowedBooks = bookTransRepo.findAllBorrowedBooks(pageable, user.getId());
        List<borrowedBookResponse> booksResponse = allBorrowedBooks.stream().map(bookMapper::toBorrowedBookResponse).toList();
        return new pageResponse<>(booksResponse, allBorrowedBooks.getNumber(), allBorrowedBooks.getSize(), allBorrowedBooks.getTotalElements(), allBorrowedBooks.getTotalPages(), allBorrowedBooks.isFirst(), allBorrowedBooks.isLast());
    }

    public pageResponse<borrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        userEntity user = (userEntity) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<bookTransHistoryEntity> allBorrowedBooks = bookTransRepo.findAllReturnedBooks(pageable, user.getId());
        List<borrowedBookResponse> booksResponse = allBorrowedBooks.stream().map(bookMapper::toBorrowedBookResponse).toList();
        return new pageResponse<>(booksResponse, allBorrowedBooks.getNumber(), allBorrowedBooks.getSize(), allBorrowedBooks.getTotalElements(), allBorrowedBooks.getTotalPages(), allBorrowedBooks.isFirst(), allBorrowedBooks.isLast());
    }

    public Integer updateShareableStatus(Integer bookId, Authentication connectedUser) {
        bookEntity book = repo.findById(bookId).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
        userEntity user = (userEntity) connectedUser.getPrincipal();
        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update others books shareable status");
        }
        book.setShareable(!book.isShareable());
        repo.save(book);
        return bookId;
    }

    public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
        bookEntity book = repo.findById(bookId).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
        userEntity user = (userEntity) connectedUser.getPrincipal();
        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update others books archived status");
        }
        book.setArchived(!book.isArchived());
        repo.save(book);
        return bookId;
    }

    public Integer borrowBook(Integer bookId, Authentication connectedUser) {
        bookEntity book = repo.findById(bookId).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book cannot be borrowed since it is archived or not shareable");
        }
        userEntity user = (userEntity) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot borrow your own book");
        }
        final boolean isAlreadyBorrowedByUser = bookTransRepo.isAlreadyBorrowedByUser(bookId, user.getId());
        if (isAlreadyBorrowedByUser) {
            throw new OperationNotPermittedException("You already borrowed this book and it is still not returned or the return is not approved by the owner");
        }

        final boolean isAlreadyBorrowedByOtherUser = bookTransRepo.isAlreadyBorrowed(bookId);
        if (isAlreadyBorrowedByOtherUser) {
            throw new OperationNotPermittedException("Te requested book is already borrowed");
        }

        bookTransHistoryEntity bookTransactionHistory = bookTransHistoryEntity.builder().user(user).book(book).isReturned(false).isReturnedApproved(false).build();
        return bookTransRepo.save(bookTransactionHistory).getId();

    }

    public Integer returnBorrowedBook(Integer bookId, Authentication connectedUser) {
        bookEntity book = repo.findById(bookId).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book is archived or not shareable");
        }
        userEntity user = (userEntity) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot borrow or return your own book");
        }

        bookTransHistoryEntity bookTransactionHistory = bookTransRepo.findByBookIdAndUserId(bookId, user.getId()).orElseThrow(() -> new OperationNotPermittedException("You did not borrow this book"));

        bookTransactionHistory.setReturned(true);
        return bookTransRepo.save(bookTransactionHistory).getId();
    }

    public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {
        bookEntity book = repo.findById(bookId).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book is archived or not shareable");
        }
        userEntity user = (userEntity) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot approve the return of a book you do not own");
        }

        bookTransHistoryEntity bookTransactionHistory = bookTransRepo.findByBookIdAndOwnerId(bookId, user.getId()).orElseThrow(() -> new OperationNotPermittedException("The book is not returned yet. You cannot approve its return"));

        bookTransactionHistory.setReturnedApproved(true);
        return bookTransRepo.save(bookTransactionHistory).getId();
    }

    public void uploadBookCoverPicture(MultipartFile file, Authentication connectedUser, Integer bookId) {
        bookEntity book = repo.findById(bookId).orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));
        userEntity user = (userEntity) connectedUser.getPrincipal();
        var profilePicture = fileStorageService.saveFile(file, user.getId());
        book.setBookCover(profilePicture);
        repo.save(book);
    }
}
