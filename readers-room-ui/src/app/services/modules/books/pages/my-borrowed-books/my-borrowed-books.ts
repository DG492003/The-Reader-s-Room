import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../models';
import { ApiConfiguration } from '../../../../api-configuration';
import { findAllBorrowedBooks, returnBorrowBook } from '../../../../functions';

@Component({
  selector: 'app-my-borrowed-books',
  imports: [],
  templateUrl: './my-borrowed-books.html',
  styleUrl: './my-borrowed-books.css',
})
export class MyBorrowedBooks implements OnInit {
  borrowedBooks: PageResponseBorrowedBookResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];
  message = '';
  level: 'success' | 'error' = 'success';
  selectedBook: BorrowedBookResponse | undefined;

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  private findAllBorrowedBooks() {
    findAllBorrowedBooks(this.http, this.apiConfig.rootUrl, {
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res: any) => {
        this.borrowedBooks = res.body as PageResponseBorrowedBookResponse;
        this.pages = Array(this.borrowedBooks.totalPages)
          .fill(0)
          .map((_, i) => i);
      },
    });
  }

  returnBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.message = '';
    returnBorrowBook(this.http, this.apiConfig.rootUrl, {
      bookId: book.id as number,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Book return request sent successfully';
        this.findAllBorrowedBooks();
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error returning book';
      },
    });
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAllBorrowedBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToLastPage() {
    this.page = (this.borrowedBooks.totalPages as number) - 1;
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page === (this.borrowedBooks.totalPages as number) - 1;
  }
}
