import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../models';
import { ApiConfiguration } from '../../../../api-configuration';
import { findAllReturnedBooks, approveReturnBorrowBook } from '../../../../functions';

@Component({
  selector: 'app-my-returned-books',
  imports: [],
  templateUrl: './my-returned-books.html',
  styleUrl: './my-returned-books.css',
})
export class MyReturnedBooks implements OnInit {
  returnedBooks: PageResponseBorrowedBookResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];
  message = '';
  level: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    findAllReturnedBooks(this.http, this.apiConfig.rootUrl, {
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res: any) => {
        this.returnedBooks = res.body as PageResponseBorrowedBookResponse;
        this.pages = Array(this.returnedBooks.totalPages)
          .fill(0)
          .map((_, i) => i);
      },
    });
  }

  approveReturn(book: BorrowedBookResponse) {
    approveReturnBorrowBook(this.http, this.apiConfig.rootUrl, {
      bookId: book.id as number,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Return approved successfully';
        this.findAllReturnedBooks();
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error approving return';
      },
    });
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAllReturnedBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToLastPage() {
    this.page = (this.returnedBooks.totalPages as number) - 1;
    this.findAllReturnedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page === (this.returnedBooks.totalPages as number) - 1;
  }
}
