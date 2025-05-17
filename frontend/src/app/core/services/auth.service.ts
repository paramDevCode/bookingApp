import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, pipe, Subject, throwError } from 'rxjs';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../utils/token-storage.service'; // Adjust path as needed
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private isRefreshing = false;
  private tokenRefreshed = new Subject<{ token: string }>();
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable(); // Optional: for components to subscribe
  private currentUserId: string | null = null;
  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {
    // Load access token from storage on app start (dev only)
    this.accessToken = this.tokenStorage.getToken();
  }

  login(data: { phoneNumber: string; password: string }) {
    return this.http.post<{ token: string; refreshToken: string }>(
      `${environment.apiUrl}/auth/login`,
      data,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        this.accessToken = res.token;

        // Store access token only in dev (localStorage)
        if (!environment.production) {
          this.tokenStorage.saveToken(res.token);
        }
        try {
          const decoded = jwtDecode<TokenPayload>(res.token);
          this.currentUserId = decoded.userId;
          console.log('Decoded userId:', this.currentUserId);
        }
        catch (err) {
          console.error('Token decoding failed:', err);
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  getUserId(): string | null {
    if (this.currentUserId) return this.currentUserId;
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        this.currentUserId = decoded.userId;
        return this.currentUserId;
      } catch (e) {
        return null;
      }
    }

    return null;
  }


  register(data: { name: string; phoneNumber: string; email: string; password: string; confirmPassword: string }) {
    return this.http.post(
      `${environment.apiUrl}/auth/register`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(() => {
        console.log('Registration successful');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration failed', error);

        // Instead of wrapping it with a generic Error, return the HttpErrorResponse itself
        return throwError(() => error);  // This will keep the original HttpErrorResponse structure
      })
    );
  }


  logout(): void {
    this.accessToken = null;
    this.tokenStorage.removeToken(); // Clear from localStorage/cookies
    // Also, backend should clear refresh token cookie
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = this.tokenStorage.getToken();
    }
    return this.accessToken;
  }

  saveUserArea(userArea: string): void {
    if (!environment.production && typeof window !== 'undefined') {
      localStorage.setItem('userArea', userArea)
    }
  }
  getUserArea(): string | null {
    if (!environment.production && typeof window !== 'undefined') {
      return localStorage.getItem('userArea')
    }
    return null
  }

  initAuth(): Observable<void> {
    return of(this.tokenStorage.getToken()).pipe(
      tap(token => {
        this.accessToken = token;
        this.isLoadingSubject.next(false);
      }),
      map(() => void 0)
    );
  }



  refreshToken(): Observable<{ token: string }> {
    if (this.isRefreshing) {
      return this.tokenRefreshed.asObservable();
    }

    this.isRefreshing = true;

    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        this.accessToken = res.token;

        if (!environment.production) {
          this.tokenStorage.saveToken(res.token);
        }

        this.tokenRefreshed.next(res);
        this.isRefreshing = false;
      }),
      catchError((error) => {
        this.logout();
        console.error('Token refresh failed', error);
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }
}
