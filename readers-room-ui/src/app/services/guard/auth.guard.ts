import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../services/token/token';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(Token);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.isTokenExpired()) {
    tokenService.clear();
    router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
    return false;
  }

  return true;
};
