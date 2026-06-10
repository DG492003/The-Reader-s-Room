package com.trr.readers_room_api.book;

import com.trr.readers_room_api.common.pageResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Book")
public class bookController {

    private final bookService service;

    @PostMapping
    public ResponseEntity<Integer> saveBook(@Valid @RequestBody bookRequest req, Authentication connectedUser) {
        return ResponseEntity.ok(service.save(req, connectedUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<bookResponse> findBookByID(@PathVariable("id") Integer bookId) {
        return ResponseEntity.ok(service.findById(bookId));
    }

    @GetMapping
    public ResponseEntity<pageResponse<bookResponse>> findAllBooks(@RequestParam(name = "page", defaultValue = "0", required = false) int page, @RequestParam(name = "size", defaultValue = "10", required = false) int size, Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllBooks(page, size, connectedUser));
    }

    @GetMapping("/owner")
    public ResponseEntity<pageResponse<bookResponse>> findAllBooksByOwner(@RequestParam(name = "page", defaultValue = "0", required = false) int page, @RequestParam(name = "size", defaultValue = "10", required = false) int size, Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllBooksByOwner(page, size, connectedUser));
    }

    @GetMapping("/borrowed")
    public ResponseEntity<pageResponse<borrowedBookResponse>> findAllBorrowedBooks(@RequestParam(name = "page", defaultValue = "0", required = false) int page, @RequestParam(name = "size", defaultValue = "10", required = false) int size, Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllBorrowedBooks(page, size, connectedUser));
    }

    @GetMapping("/returned")
    public ResponseEntity<pageResponse<borrowedBookResponse>> findAllReturnedBooks(@RequestParam(name = "page", defaultValue = "0", required = false) int page, @RequestParam(name = "size", defaultValue = "10", required = false) int size, Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllReturnedBooks(page, size, connectedUser));
    }

    @PatchMapping("/shareable/{bookId}")
    public ResponseEntity<Integer> updateShareableStatus(@PathVariable("bookId") Integer bookId, Authentication connectedUser) {
        return ResponseEntity.ok(service.updateShareableStatus(bookId, connectedUser));
    }

    @PatchMapping("/archived/{bookId}")
    public ResponseEntity<Integer> updateArchivedStatus(@PathVariable("bookIid") Integer bookId, Authentication connectedUser) {
        return ResponseEntity.ok(service.updateArchivedStatus(bookId, connectedUser));
    }

    @PostMapping("borrow/{bookId}")
    public ResponseEntity<Integer> borrowBook(@PathVariable("bookId") Integer bookId, Authentication connectedUser) {
        return ResponseEntity.ok(service.borrowBook(bookId, connectedUser));
    }

    @PatchMapping("borrow/return/{bookId}")
    public ResponseEntity<Integer> returnBorrowBook(@PathVariable("bookId") Integer bookId, Authentication connectedUser) {
        return ResponseEntity.ok(service.returnBorrowedBook(bookId, connectedUser));
    }

    @PatchMapping("borrow/return/approve/{bookId}")
    public ResponseEntity<Integer> approveReturnBorrowBook(@PathVariable("bookId") Integer bookId, Authentication connectedUser) {
        return ResponseEntity.ok(service.approveReturnBorrowedBook(bookId, connectedUser));
    }

    @PostMapping(value = "/cover/{bookId}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadBookCoverPicture(@PathVariable("bookId") Integer bookId, @Parameter @RequestPart("file") MultipartFile file, Authentication connectedUser) {
        service.uploadBookCoverPicture(file, connectedUser, bookId);
        return ResponseEntity.accepted().build();
    }


}

