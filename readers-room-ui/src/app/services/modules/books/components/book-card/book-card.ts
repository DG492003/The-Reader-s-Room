import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookResponse } from '../../../../models/book-response';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [Rating, CommonModule],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {

  private _book: BookResponse = {};
  private _manage = false;
  synopsisExpanded = false;

  get bookCover(): string | undefined {
    if (this._book.cover) {
      return 'data:image/jpg;base64,' + this._book.cover;
    }
    return 'assets/images/book-placeholder.png';
  }

  get book(): BookResponse {
    return this._book;
  }

  @Input()
  set book(value: BookResponse) {
    this._book = value;
  }

  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }

  @Output() share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  onShare() { this.share.emit(this._book); }
  onArchive() { this.archive.emit(this._book); }
  onAddToWaitingList() { this.addToWaitingList.emit(this._book); }
  onBorrow() { this.borrow.emit(this._book); }
  onEdit() { this.edit.emit(this._book); }
  onShowDetails() { this.details.emit(this._book); }
  toggleSynopsis(event: Event) {
    event.stopPropagation();
    this.synopsisExpanded = !this.synopsisExpanded;
  }
}
