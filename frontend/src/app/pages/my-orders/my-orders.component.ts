import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import {Booking} from '../../models/booking';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
 
 @Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
orders: Booking[] = [];
  loading = true;
  constructor( private authService: AuthService, private orderService:OrderService,
       
  ){}
  
 
   ngOnInit(): void {
  const userId = this.authService.getUserId();
  if (userId) {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (res) => {
        this.orders = res as Booking[]; // type assertion if needed
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }
}

goToOrderDetails(){
  
}
 
}
