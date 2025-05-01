// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  if (token) {
    return true;
  }

  // no token → redirect to login, keep returnUrl so we can navigate back
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
