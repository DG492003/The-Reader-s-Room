import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../models';
import { ApiConfiguration } from '../../../../api-configuration';
import { findAllBorrowedBooks, returnBorrowBook } from '../../../../functions';

@Component({
  selector: 'app-my-waiting-list',
  imports: [],
  templateUrl: './my-waiting-list.html',
  styleUrl: './my-waiting-list.css',
})
export class MyWaitingList implements OnInit {
  borrowedBooks: PageResponseBorrowedBookResponse = {};
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
    this.findAll();
  }

  private findAll() {
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
    this.message = '';
    returnBorrowBook(this.http, this.apiConfig.rootUrl, {
      bookId: book.id as number,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Book returned successfully';
        this.findAll();
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error returning book';
      },
    });
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAll();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAll();
  }

  goToPreviousPage() {
    this.page--;
    this.findAll();
  }

  goToLastPage() {
    this.page = (this.borrowedBooks.totalPages as number) - 1;
    this.findAll();
  }

  goToNextPage() {
    this.page++;
    this.findAll();
  }

  get isLastPage(): boolean {
    return this.page === (this.borrowedBooks.totalPages as number) - 1;
  }
}
