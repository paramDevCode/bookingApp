import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
private baseUrl = environment.apiUrl
  constructor(private http:HttpClient) { }

  getOrders(){
    return this.http.get(`${this.baseUrl}/orders`);
  }

  createOrder(order: any) {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }
}
