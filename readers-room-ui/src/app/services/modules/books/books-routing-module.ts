import { Routes } from '@angular/router';
import { authGuard } from '../../guard/auth.guard';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main/main').then(m => m.Main),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/book-list/book-list').then(m => m.BookList),
        canActivate: [authGuard],
      },
      {
        path: 'my-books',
        loadComponent: () => import('./pages/my-books/my-books').then(m => m.MyBooks),
        canActivate: [authGuard],
      },
      {
        path: 'my-borrowed-books',
        loadComponent: () => import('./pages/my-borrowed-books/my-borrowed-books').then(m => m.MyBorrowedBooks),
        canActivate: [authGuard],
      },
      {
        path: 'my-returned-books',
        loadComponent: () => import('./pages/my-returned-books/my-returned-books').then(m => m.MyReturnedBooks),
        canActivate: [authGuard],
      },
      {
        path: 'my-waiting-list',
        loadComponent: () => import('./pages/my-waiting-list/my-waiting-list').then(m => m.MyWaitingList),
        canActivate: [authGuard],
      },
      {
        path: 'manage',
        loadComponent: () => import('./pages/manage-book/manage-book').then(m => m.ManageBook),
        canActivate: [authGuard],
      },
      {
        path: 'manage/:bookId',
        loadComponent: () => import('./pages/manage-book/manage-book').then(m => m.ManageBook),
        canActivate: [authGuard],
      },
      {
        path: 'details/:bookId',
        loadComponent: () => import('./pages/book-details/book-details').then(m => m.BookDetails),
        canActivate: [authGuard],
      },
    ],
  },
];

