import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import {Booking} from '../../models/booking';

export interface Order {
  _id?: string;               // MongoDB unique order ID (optional because not needed when creating)
  userId: string;             // User who placed the order
  service: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  notes?: string;
  imageUrls?: string[];
  status?: 'pending' | 'completed' | 'canceled'; // you can restrict it more precisely
  createdAt?: string | Date;   // optional, returned by backend
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private authService: AuthService,
) {}

  // Create a new order
  createOrder(orderData: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderData);
  }

   // Get all orders by userId
  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Get a single order by order id
 getOrderById(id: string): Observable<Booking> {
  return this.http.get<Booking>(`${this.baseUrl}/${id}`);
}


 }
