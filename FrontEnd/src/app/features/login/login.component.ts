import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = signal(false);
  isError = signal(false);
  error= signal('');

  constructor(private fb: FormBuilder, private userService:UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  getEmailError(): string {
    const ctrl = this.loginForm.get('email');
    if (ctrl?.hasError('required')) return 'Email is required';
    if (ctrl?.hasError('email')) return 'Enter a valid email address';
    return '';
  }

  getPasswordError(): string {
    const ctrl = this.loginForm.get('password');
    if (ctrl?.hasError('required')) return 'Password is required';
    if (ctrl?.hasError('minlength')) return 'Password must be at least 8 characters';
    return '';
  }

  createAccount(): void {
    this.router.navigate(['/create-user']);
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.userService.login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      ).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.router.navigate(['/home']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.isError.set(true);
          this.error.set(err.error?.message || err.message);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
