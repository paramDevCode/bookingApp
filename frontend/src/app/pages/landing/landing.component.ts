import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { TokenStorageService } from '../../utils/token-storage.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  areas: string[] = ['Ambattur', 'Anna Nagar', 'T. Nagar', 'Adyar', 'Perungudi'];
  selectedArea: string | null = null;

  constructor(private router: Router, private localStorageService:LocalStorageService, 
     private tokenStorage: TokenStorageService,
     private toastService: ToastService) {}

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    const area = this.localStorageService.getItem('userArea')
    // Check if the user has already selected a location
    if (this.localStorageService.getItem('userArea')) {
      this.router.navigate(['/register']);
    }
    if (token) {
      // ✅ User is already logged in — redirect to main dashboard/home
      this.router.navigate(['/orders']);
    } else if (area) {
      // 🤔 User selected area before, but not logged in — redirect to register
      this.router.navigate(['/register']);
    }
  }

  selectLocation(): void {
    if (this.selectedArea) {
      this.localStorageService.setItem('userArea', this.selectedArea);
      this.router.navigate(['/register']);
    } else {
      console.log('Toast should show now'); // ✅ DEBUG LINE

      this.toastService.showToast({
      message: 'Please select a location!',
      type: 'error'
      })
      
    }
  }
}
