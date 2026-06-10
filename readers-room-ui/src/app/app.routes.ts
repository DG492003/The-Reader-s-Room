import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        loadComponent: () => import('./Pages/register/register').then(m => m.Register)
    },
    {
        path: 'activate-account',
        loadComponent: () => import('./Pages/activate-account/activate-account').then(m => m.ActivateAccount)
    },
    {
        path: 'books',
        loadChildren: () => import('./modules/books/books-module').then(m => m.BooksModule)
    },
];
