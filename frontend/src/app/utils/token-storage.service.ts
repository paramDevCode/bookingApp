import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  // Save token to localStorage or cookies based on the environment
  saveToken(token: string): void {
    if (environment.production) {
      this.saveTokenToCookies(token);
    } else {
      this.saveTokenToLocalStorage(token);
    }
  }

  // Retrieve token from localStorage or cookies based on the environment
  getToken(): string | null {
    if (environment.production) {
      return this.getTokenFromCookies();
    } else {
      return this.getTokenFromLocalStorage();
    }
  }

  // Remove token from localStorage or cookies based on the environment
  removeToken(): void {
    if (environment.production) {
      this.removeTokenFromCookies();
    } else {
      this.removeTokenFromLocalStorage();
    }
  }

  // **LocalStorage Methods**
  private saveTokenToLocalStorage(token: string): void {
    localStorage.setItem('token', token);
  }

  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }

  private removeTokenFromLocalStorage(): void {
    localStorage.removeItem('token');
  }

  // **Cookies Methods**
  private saveTokenToCookies(token: string): void {
    // Set HttpOnly cookies (ensure `Secure` flag and SameSite attribute)
    document.cookie = `token=${token}; path=/; HttpOnly; Secure; SameSite=Strict`;
  }

  private getTokenFromCookies(): string | null {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  }

  private removeTokenFromCookies(): void {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict';
  }
}
