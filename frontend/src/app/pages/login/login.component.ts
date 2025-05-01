import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  onLogin() {
    const formData = this.loginForm.value as { phoneNumber: string; password: string };

    if (this.loginForm.valid) {
      this.authService.login(formData).subscribe({
        next: (res) => {
          // The access token is stored in memory, not in localStorage
          // No need to store the token here
          this.router.navigate(['/orders']); // or dashboard route
        },
        error: () => alert('Login failed')
      });
    }
  }
}
