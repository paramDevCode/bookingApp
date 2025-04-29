import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getRefreshToken()) {
        console.warn('[Interceptor] Access token expired. Attempting refresh...');

        return authService.refreshToken().pipe(
          switchMap((res) => {
            localStorage.setItem('token', res.token);
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`,
              },
            });
            return next(retryReq);
          }),
          catchError(() => {
            console.error('[Interceptor] Refresh failed. Logging out.');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            router.navigate(['/login']);
            return throwError(() => new Error('Session expired'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
