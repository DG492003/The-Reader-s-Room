import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookCard } from '../../components/book-card/book-card';
import { BookResponse, PageResponseBookResponse } from '../../../../models';
import { ApiConfiguration } from '../../../../api-configuration';
import {
  findAllBooksByOwner,
  updateShareableStatus,
  updateArchivedStatus,
} from '../../../../functions';

@Component({
  selector: 'app-my-books',
  imports: [BookCard, RouterLink],
  templateUrl: './my-books.html',
  styleUrl: './my-books.css',
})
export class MyBooks implements OnInit {
  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];
  message = '';
  level: 'success' | 'error' = 'success';

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    findAllBooksByOwner(this.http, this.apiConfig.rootUrl, {
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (books: any) => {
        this.bookResponse = books.body as PageResponseBookResponse;
        this.pages = Array(this.bookResponse.totalPages)
          .fill(0)
          .map((_, i) => i);
      },
    });
  }

  archiveBook(book: BookResponse) {
    updateArchivedStatus(this.http, this.apiConfig.rootUrl, {
      bookId: book.id as number,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = book.archived
          ? 'Book unarchived successfully'
          : 'Book archived successfully';
        this.findAllBooks();
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error updating archive status';
      },
    });
  }

  shareBook(book: BookResponse) {
    updateShareableStatus(this.http, this.apiConfig.rootUrl, {
      bookId: book.id as number,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = book.shareable
          ? 'Book is no longer shareable'
          : 'Book is now shareable';
        this.findAllBooks();
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error updating shareable status';
      },
    });
  }

  editBook(book: BookResponse) {
    this.router.navigate(['/books', 'manage', book.id]);
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAllBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  goToLastPage() {
    this.page = (this.bookResponse.totalPages ?? 1) - 1;
    this.findAllBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    return this.page === (this.bookResponse.totalPages ?? 1) - 1;
  }
}
