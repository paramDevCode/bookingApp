import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'; // Make sure this path is correct

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  // Always include cookies for both dev and production
  let authReq = req.clone({
    withCredentials: true,
  });

  // In development mode, attach Authorization header manually
  if (!environment.production && token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('[Interceptor] Access token expired. Attempting refresh...');

        return authService.refreshToken().pipe(
          switchMap((res) => {
            const retryReq = req.clone({
              withCredentials: true,
              ...( !environment.production && {
                setHeaders: { Authorization: `Bearer ${res.token}` }
              })
            });
            return next(retryReq);
          }),
          catchError(() => {
            console.error('[Interceptor] Refresh failed. Logging out.');
            authService.logout();
            return throwError(() => new Error('Session expired'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
