import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  saveToken(token: string): void {
    if (!environment.production && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (!environment.production && typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  removeToken(): void {
    if (!environment.production && typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}
