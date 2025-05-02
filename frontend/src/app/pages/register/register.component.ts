import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsMatchValidator });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private toastService: ToastService

  ) {}

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastService.showToast({
        message: 'Please correct the errors in the form.',
        type: 'error'
      });
      return;
    }
  
    const { name, phoneNumber, email, password, confirmPassword } = this.registerForm.value;
  
    if (!name?.trim() || !phoneNumber?.trim() || !email?.trim() || !password || !confirmPassword) {
      this.toastService.showToast({
        message: 'All fields are required.',
        type: 'error'
      });
      return;
    }
  
    if (password !== confirmPassword) {
      this.toastService.showToast({
        message: 'Passwords do not match.',
        type: 'error'
      });
      return;
    }
  
    this.authService.register({ name, phoneNumber, email, password, confirmPassword }).subscribe({
      next: () => {
        this.toastService.showToast({
          message: 'Registration successful!',
          type: 'success'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const errorMessage =
          err.error?.message === 'Customer already registered.'
            ? 'Customer already registered with same phone number.'
            : err.error?.message || 'Registration failed.';
  
        this.toastService.showToast({
          message: errorMessage,
          type: 'error'
        });
      }
    });
  }
  
  

  onLoginRedirect(): void {
    this.router.navigate(['/login']);
  }

  get f() {
    return this.registerForm.controls;
  }
}
