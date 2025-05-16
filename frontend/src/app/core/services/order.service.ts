import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Order {
  service: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  notes?: string;
  imageUrls?: string[];
  status?: string; // 'pending', 'completed', 'canceled'
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderData);
  }

  // You can add more methods like getOrders(), updateOrder(), etc. here
}
