import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  template: `
    <div class="d-flex gap-1">
      @for (star of stars; track $index) {
        <i [class]="star"></i>
      }
    </div>
  `
})
export class Rating {
  @Input() rating: number = 0;

  get stars(): string[] {
    const fullStars = Math.floor(this.rating);
    const hasHalf = this.rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    return [
      ...Array(fullStars).fill('ti ti-star-filled text-warning'),
      ...(hasHalf ? ['ti ti-star-half text-warning'] : []),
      ...Array(emptyStars).fill('ti ti-star text-warning')
    ];
  }
}
