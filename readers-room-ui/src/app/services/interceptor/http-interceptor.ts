import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Token } from '../services/token/token';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const router = inject(Router);
  const token = tokenService.getToken();

  // If token exists but is already expired, clear and redirect before even making the request
  if (token && tokenService.isTokenExpired()) {
    tokenService.clear();
    router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
    return throwError(() => new Error('Token expired'));
  }

  const clonedReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // 401 from server — token expired or invalid
        tokenService.clear();
        router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
      }
      return throwError(() => error);
    })
  );
};
