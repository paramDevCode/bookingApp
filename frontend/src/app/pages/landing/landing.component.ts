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

  constructor(private router: Router, private localStorageService: LocalStorageService, 
    private tokenStorage: TokenStorageService, private toastService: ToastService) {}

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    const area = this.localStorageService.getItem('userArea');
    
    console.log('OnInit - Token:', token); // Debug: Check if token exists
    console.log('OnInit - Area from localStorage:', area); // Debug: Check if area exists

    if (token) {
      this.router.navigate(['/orders']);
    }
  }

  selectLocation(): void {
    console.log('Selected Area:', this.selectedArea); // Debug: Check if area is selected
    
    if (this.selectedArea) {
      // Save the selected area to localStorage
      this.localStorageService.setItem('userArea', this.selectedArea);
      console.log('Area saved to localStorage:', this.selectedArea); // Debug: Confirm it’s being saved

      // Redirect to the register page
      this.router.navigate(['/register']);
    } else {
      // Show a toast message if no area is selected
      this.toastService.showToast({
        message: 'Please select a location!',
        type: 'error'
      });
    }
  }
}
