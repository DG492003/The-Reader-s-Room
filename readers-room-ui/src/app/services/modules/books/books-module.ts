// books-module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BOOKS_ROUTES } from './books-routing-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(BOOKS_ROUTES),
  ],
})
export class BooksModule {}