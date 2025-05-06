// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  const userArea = authService.getUserArea();

  // ✅ If user has a valid token, allow access to any route
  if (token) {
    return true;
  }

  // ✅ If trying to access the login page
  if (state.url === '/login') {
    // ❌ First-time user with no selected area → redirect to area selection
    if (!userArea) {
      router.navigate(['/select-area'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // ✅ Area is selected → allow login
    return true;
  }

  // ❌ No token and not accessing /login → redirect to login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
