import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  customerName = 'Anjali';
  selectedService = '';
  notes = '';
  alternateName = '';
  alternatePhone = '';
  estimatedPrice: number | null = null;
  selectedFile: File | null = null;

  constructor(private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  updatePrice() {
    this.estimatedPrice = this.calculatePrice();
  }

  calculatePrice(): number {
    switch (this.selectedService) {
      case 'alteration': return 200;
      case 'blouse-with-lining': return 500;
      case 'blouse-without-lining': return 400;
      case 'falls': return 150;
      case 'pattu': return 800;
      default: return 0;
    }
  }

  bookService() {
    this.estimatedPrice = this.calculatePrice();
    const orderDetails = {
      customerName: this.customerName,
      service: this.selectedService,
      notes: this.notes,
      alternateName: this.alternateName,
      alternatePhone: this.alternatePhone,
      file: this.selectedFile,
      price: this.estimatedPrice
    };

    console.log(orderDetails);

    // Optional: Navigate or show confirmation message
    // this.router.navigate(['/order-confirmation'], { state: orderDetails });
  }
}
