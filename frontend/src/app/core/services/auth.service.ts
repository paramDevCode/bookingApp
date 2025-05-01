import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private isRefreshing = false;
  private tokenRefreshed = new Subject<{ token: string }>();

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { phoneNumber: string; password: string }) {
    return this.http.post<{ token: string; refreshToken: string }>(
      `${environment.apiUrl}/auth/login`,
      data,
      { withCredentials: true }  // Allow the browser to send cookies with the request
    ).pipe(
      tap((res) => {
        // Store the access token in memory
        this.accessToken = res.token;

        // Do not store refreshToken in localStorage; it's stored in cookies
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  logout(): void {
    this.accessToken = null;  // Clear the access token in memory
    // Optionally, clear the refresh token in cookies as well by sending a request to logout
    document.cookie = 'refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';  // Remove refresh token cookie
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return this.accessToken;  // Return the access token from memory
  }

  refreshToken(): Observable<{ token: string }> {
    if (this.isRefreshing) {
      return this.tokenRefreshed.asObservable(); // Wait for ongoing refresh
    }

    this.isRefreshing = true;

    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true } // Refresh token sent via HttpOnly cookie
    ).pipe(
      tap((res) => {
        this.accessToken = res.token;  // Store new access token in memory
        this.tokenRefreshed.next(res);
        this.isRefreshing = false;
      }),
      catchError((error) => {
        this.logout();  // Logout if refresh token fails
        console.error('Token refresh failed', error);
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }
}
