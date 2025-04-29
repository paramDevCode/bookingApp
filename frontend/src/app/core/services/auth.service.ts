import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isRefreshing = false;
  private tokenRefreshed = new Subject<{ token: string }>();

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { phoneNumber: string; password: string }) {
    return this.http.post<{ token: string; refreshToken: string }>(
      `${environment.apiUrl}/auth/login`,
      data
    ).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  refreshToken(): Observable<{ token: string }> {
    if (this.isRefreshing) {
      return this.tokenRefreshed.asObservable(); // Return the refreshed token if it's already being refreshed
    }

    this.isRefreshing = true;

    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.tokenRefreshed.next(res); // Emit the refreshed token to the waiting observables
        this.isRefreshing = false;
      }),
      catchError((error) => {
        // Handle refresh token errors (e.g., token expired or invalid)
        this.logout(); // Log the user out if refresh token fails
        console.error('Token refresh failed', error);
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }
}
