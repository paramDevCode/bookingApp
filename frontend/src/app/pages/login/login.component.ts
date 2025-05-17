import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = this.fb.group({
    phoneNumber: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    const token = this.authService.getAccessToken();

    if (token) {
      // If already logged in, redirect
      this.router.navigate(['/orders']);
    }
        console.log('userId ',this.authService.getUserId())

  }
  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.showToast({
        message: 'Please fill in all required fields.',
        type: 'error'
      });
      return;
    }

    const formData = this.loginForm.value as { phoneNumber: string | null; password: string | null };
    const phoneNumber = formData.phoneNumber?.trim() || '';
    const password = formData.password?.trim() || '';

    if (!phoneNumber || !password) {
      this.toastService.showToast({
        message: 'Phone number and password are required.',
        type: 'error'
      });
      return;
    }

    this.authService.login({ phoneNumber, password }).subscribe({
      next: () => {
        this.toastService.showToast({
          message: 'Login successful!',
          type: 'success'
        });
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.toastService.showToast({
          message: err?.error?.message || 'Incorrect phone number or password.',
          type: 'error'
        });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onRegisterRedirect(): void {
    this.router.navigate(['/register']);
  }
}
