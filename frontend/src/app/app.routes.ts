import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    { path: 'login', component: LoginComponent },
     { path: 'orders', component: OrdersComponent, canActivate:[authGuard] },
];

