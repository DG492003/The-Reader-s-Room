import { Routes } from '@angular/router';
import { Login } from './services/Pages/login/login';
import { registrationGuard } from './services/guard/registration.guard';

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
        loadComponent: () => import('./services/Pages/register/register').then(m => m.Register)
    },
    {
        path: 'activate-account',
        canActivate: [registrationGuard],
        loadComponent: () => import('./services/Pages/activate-account/activate-account').then(m => m.ActivateAccount)
    },
    {
        path: 'books',
        loadChildren: () => import('./services/modules/books/books-routing-module').then(m => m.BOOKS_ROUTES)
    },
];
