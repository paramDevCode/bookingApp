import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  saveToken(token: string): void {
    if (!environment.production) {
      localStorage.setItem('token', token);
    }
    // No need to save token manually in cookies in production — server handles it via HttpOnly cookies
  }

  getToken(): string | null {
    if (!environment.production) {
      return localStorage.getItem('token');
    }
    // Cannot read HttpOnly cookies in production — server reads them
    return null;
  }

  removeToken(): void {
    if (!environment.production) {
      localStorage.removeItem('token');
    }
    // In production, let the server clear the cookie (e.g., via logout route)
  }
}
