import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UploadService } from '../../core/services/upload.service';
import { OrderService, Order } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { IMAGE_BASE_URL } from '../../constants';
import { ToastService } from '../../core/services/toast.service';  
import { AuthService } from '../../core/services/auth.service';

import {Booking} from '../../models/booking';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  imageBaseUrl = IMAGE_BASE_URL;

  orderForm!: FormGroup;
  locationError = false;
  uploadedImageUrls: string[] = [];
  selectedFiles: File[] = [];

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private orderService: OrderService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
this.orderService.getOrderById('6828455429ef80a7fce359b2')
  .subscribe(order => {
    console.log('Fetched Order:', order);
  });

    
    this.orderForm = this.fb.group({
      service: ['', Validators.required],
      pickupLatitude: [''],
      pickupLongitude: [''],
      mobile:[''],
      pickupAddress: ['', Validators.required],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      notes: [''],
      images: [[]]
    });

    this.getLocation();
    
  }

  getLocation(): void {
    if (!navigator.geolocation) {
      this.locationError = true;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.orderForm.patchValue({
          pickupLatitude: lat,
          pickupLongitude: lng
        });

        this.reverseGeocode(lat, lng);
      },
      () => {
        this.locationError = true;
      }
    );
  }

  reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const address = data.display_name || '';
        this.orderForm.patchValue({
          pickupAddress: address
        });
      })
      .catch(() => {
        this.locationError = true;
      });
  }

  refreshLocation(): void {
    this.getLocation();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const filesArray = Array.from(input.files).slice(0, 4);
    this.selectedFiles = filesArray;

    this.uploadService.uploadImages(filesArray).subscribe({
      next: response => {
        const newFilenames = response.files.map(file => file.filename);
        this.uploadedImageUrls = [...this.uploadedImageUrls, ...newFilenames];
        this.toastService.showToast({
          message: 'Images uploaded successfully!',
          type: 'success'
        });
      },
      error: err => {
        console.error('Upload failed', err);
        this.toastService.showToast({
          message: 'Image upload failed. Please try again.',
          type: 'error'
        });
      }
    });
  }

  removeImage(index: number): void {
    const filename = this.uploadedImageUrls[index];
    if (!filename) return;

    this.uploadService.deleteImage(filename).subscribe({
      next: () => {
        this.uploadedImageUrls.splice(index, 1);
        this.toastService.showToast({
          message: 'Image removed successfully.',
          type: 'success'
        });
      },
      error: err => {
        console.error('Failed to delete image:', err);
        this.toastService.showToast({
          message: 'Failed to remove image.',
          type: 'error'
        });
      }
    });
  }

 submitOrder(): void {
    if (this.orderForm.invalid) {
      this.toastService.showToast({
        message: 'Please fill in all required fields.',
        type: 'error'
      });
      this.orderForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastService.showToast({
        message: 'User is not logged in.',
        type: 'error'
      });
      return;
    }

    this.submitting = true;

    const orderData: Order = {
      ...this.orderForm.value,
      imageUrls: this.uploadedImageUrls,
      status: 'pending',
      userId  // add userId here!
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.toastService.showToast({
          message: 'Order submitted successfully!',
          type: 'success'
        });
        this.orderForm.reset();
        this.uploadedImageUrls = [];
        this.submitting = false;
      },
      error: () => {
        this.toastService.showToast({
          message: 'Failed to submit order. Please try again.',
          type: 'error'
        });
        this.submitting = false;
      }
    });
  }

}
