import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  BookResponse,
  FeedbackRequest,
  FeedbackResponse,
  PageResponseFeedbackResponse,
} from '../../../../models';
import { ApiConfiguration } from '../../../../api-configuration';
import { findBookById, findAllFeedbacksByBook, saveFeedback } from '../../../../functions';
import { Rating } from '../../components/rating/rating';


@Component({
  selector: 'app-book-details',
  imports: [FormsModule, Rating, CommonModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails implements OnInit {
  book: BookResponse = {};
  feedbackResponse: PageResponseFeedbackResponse = {};
  feedbackPage = 0;
  feedbackSize = 5;
  feedbackPages: number[] = [];
  message = '';
  level: 'success' | 'error' = 'success';

  feedbackRequest: FeedbackRequest = {
    bookId: 0,
    comment: '',
    note: 0,
  };
  hoverRating = 0;

  get bookCover(): string {
    if (this.book.cover) {
      return 'data:image/jpg;base64,' + this.book.cover;
    }
    return 'assets/images/book-placeholder.png';
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('bookId'));
    this.feedbackRequest.bookId = id;
    findBookById(this.http, this.apiConfig.rootUrl, { id }).subscribe({
      next: (res: any) => {
        this.book = res.body as BookResponse;
      },
    });
    this.loadFeedbacks(id);
  }

  private loadFeedbacks(bookId: number) {
    findAllFeedbacksByBook(this.http, this.apiConfig.rootUrl, {
      'book-id': bookId,
      page: this.feedbackPage,
      size: this.feedbackSize,
    }).subscribe({
      next: (res: any) => {
        this.feedbackResponse = res.body as PageResponseFeedbackResponse;
        this.feedbackPages = Array(this.feedbackResponse.totalPages)
          .fill(0)
          .map((_, i) => i);
      },
    });
  }

  setRating(value: number) {
    this.feedbackRequest.note = value;
  }

  submitFeedback() {
    this.message = '';
    saveFeedback(this.http, this.apiConfig.rootUrl, {
      body: this.feedbackRequest,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Feedback submitted successfully';
        this.feedbackRequest.comment = '';
        this.feedbackRequest.note = 0;
        this.loadFeedbacks(this.feedbackRequest.bookId);
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error submitting feedback';
      },
    });
  }

  gotToFeedbackPage(page: number) {
    this.feedbackPage = page;
    this.loadFeedbacks(this.feedbackRequest.bookId);
  }

  goToFirstFeedbackPage() {
    this.feedbackPage = 0;
    this.loadFeedbacks(this.feedbackRequest.bookId);
  }

  goToPreviousFeedbackPage() {
    this.feedbackPage--;
    this.loadFeedbacks(this.feedbackRequest.bookId);
  }

  goToLastFeedbackPage() {
    this.feedbackPage = (this.feedbackResponse.totalPages ?? 1) - 1;
    this.loadFeedbacks(this.feedbackRequest.bookId);
  }

  goToNextFeedbackPage() {
    this.feedbackPage++;
    this.loadFeedbacks(this.feedbackRequest.bookId);
  }

  get isFeedbackLastPage(): boolean {
    return this.feedbackPage === (this.feedbackResponse.totalPages ?? 1) - 1;
  }
}
