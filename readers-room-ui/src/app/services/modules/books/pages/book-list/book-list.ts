import { Component, OnInit } from '@angular/core';
import { BookResponse, PageResponseBookResponse } from '../../../../models';
import { Router } from '@angular/router';
import { borrowBook as borrowBookFn, findAllBooks } from '../../../../functions';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../api-configuration';
import { BookCard } from '../../components/book-card/book-card';

@Component({
  selector: 'app-book-list',
  imports: [BookCard],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 5;
  pages: any = [];
  message = '';
  level: 'success' |'error' = 'success';

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    findAllBooks(this.http, this.apiConfig.rootUrl, {
      page: this.page,
      size: this.size
    })
      .subscribe({
        next: (books: any) => {
          this.bookResponse = books.body as PageResponseBookResponse;
          this.pages = Array(this.bookResponse.totalPages)
            .fill(0)
            .map((x, i) => i);
        }
      });
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
    this.page --;
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

  get isLastPage() {
    return this.page === (this.bookResponse.totalPages ?? 1) - 1;
  }

  borrowBook(book: BookResponse) {
    this.message = '';
    this.level = 'success';
    borrowBookFn(this.http, this.apiConfig.rootUrl, {
      bookId: book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Book successfully added to your list';
      },
      error: (err: any) => {
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    });
  }

  displayBookDetails(book: BookResponse) {
    this.router.navigate(['/books', 'details', book.id]);
  }
}
