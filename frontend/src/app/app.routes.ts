import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect to /landing
  { path: '', redirectTo: 'landing', pathMatch: 'full' },

  // Landing Page (Area Selection)
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },

  // Login Page (Guarded to check if area selected)
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Register Page (can add guard if needed)
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },

  // Orders Page (Protected for logged-in users)
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
  },

  // Alias path to match redirect in auth guard
  {
    path: 'select-area',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
   path: '**',
   redirectTo: 'landing'
 }
];
