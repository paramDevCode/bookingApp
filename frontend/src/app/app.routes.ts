import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
 export const routes: Routes = [
    { path: '', component: LandingComponent },
    {path:'', redirectTo:'landing', pathMatch:'full'},
    { path: 'landing', component: LandingComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },  // Add register route

     { path: 'orders', component: OrdersComponent, canActivate:[authGuard] },
];

