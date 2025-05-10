// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  const userArea = authService.getUserArea();
  const url = state.url;

  console.log('Guard check → Token:', token, 'Area:', userArea, 'State URL:', url);

  // ⛔ No area selected → redirect to area selection
  if (!userArea) {
    console.log('❌ No area selected → redirect to /landing');
    return router.createUrlTree(['/landing'], { queryParams: { returnUrl: url } });
  }

  // ⛔ No token yet → allow register and login only
  if (!token) {
    if (url === '/register' || url === '/login') {
      console.log('✅ Area selected & no token → allow register/login');
      return true;
    }

    console.log('❌ No token → redirect to /login');
    return router.createUrlTree(['/login']);
  }

  // ✅ Token present → block access to register/login
  if (url === '/register' || url === '/login') {
    console.log('✅ Already logged in → redirect to /orders');
    return router.createUrlTree(['/orders']);
  }

  // ✅ Authenticated and area selected
  console.log('✅ Authenticated → allow access');
  return true;
};
