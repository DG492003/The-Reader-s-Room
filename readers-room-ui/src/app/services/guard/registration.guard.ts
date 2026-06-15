import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const REGISTRATION_FLAG = 'pendingActivation';

export const registrationGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (sessionStorage.getItem(REGISTRATION_FLAG) === 'true') {
    return true;
  }

  // Direct URL access — send them to register
  router.navigate(['/register']);
  return false;
};
