import { Component, OnDestroy, OnInit } from '@angular/core';
import { Toast, ToastService } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: Toast | null = null;  // Initialize as null
  private toastSubscription: Subscription = new Subscription();
  
  constructor(private toastService: ToastService) {}
  ngOnInit() {
    this.toastSubscription = this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
    });
  }
  ngOnDestroy() {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }
 
}
