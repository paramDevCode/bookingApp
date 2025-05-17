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
    canActivate: [authGuard],
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },

  // Orders Page (Protected for logged-in users)
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'my-orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-orders/my-orders.component').then(m => m.MyOrdersComponent )
  },

  {
    path:'**',
    loadComponent:()=> import('./pages/not-found/not-found.component').then(m=> m.NotFoundComponent)
  }

  
];
