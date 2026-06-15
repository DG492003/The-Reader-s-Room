import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookRequest, BookResponse } from '../../../../models';
import { ApiConfiguration } from '../../../../api-configuration';
import { saveBook, findBookById, uploadBookCoverPicture } from '../../../../functions';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.css',
})
export class ManageBook implements OnInit {
  bookRequest: BookRequest = {
    title: '',
    authorName: '',
    isbn: '',
    synopsis: '',
    shareable: true,
  };
  selectedCover: File | null = null;
  selectedCoverPreview: string | null = null;
  message = '';
  level: 'success' | 'error' = 'success';
  bookId: number | null = null;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('bookId');
    if (id) {
      this.bookId = Number(id);
      this.isEditMode = true;
      this.loadBook(this.bookId);
    }
  }

  private loadBook(id: number) {
    findBookById(this.http, this.apiConfig.rootUrl, { id }).subscribe({
      next: (res: any) => {
        const book = res.body as BookResponse;
        this.bookRequest = {
          id: book.id,
          title: book.title ?? '',
          authorName: book.authorName ?? '',
          isbn: book.isbn ?? '',
          synopsis: book.synopsis ?? '',
          shareable: book.shareable ?? true,
        };
      },
    });
  }

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedCover = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedCoverPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedCover);
    }
  }

  onSubmit() {
    this.message = '';
    saveBook(this.http, this.apiConfig.rootUrl, { body: this.bookRequest }).subscribe({
      next: (res: any) => {
        const savedId: number = res.body;
        if (this.selectedCover) {
          uploadBookCoverPicture(this.http, this.apiConfig.rootUrl, {
            bookId: savedId,
            body: { file: this.selectedCover },
          }).subscribe({
            next: () => this.navigateBack(),
            error: () => this.navigateBack(),
          });
        } else {
          this.navigateBack();
        }
      },
      error: (err: any) => {
        this.level = 'error';
        this.message = err.error?.error ?? 'Error saving book';
      },
    });
  }

  private navigateBack() {
    this.router.navigate(['books', 'my-books']);
  }
}
