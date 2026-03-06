import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-create-user',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  createForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = signal(false);
  isError = signal(false);
  error= signal('');

  constructor(private fb: FormBuilder, private userService:UserService, private router: Router) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  getEmailError(): string {
    const ctrl = this.createForm.get('email');
    if (ctrl?.hasError('required')) return 'Email is required';
    if (ctrl?.hasError('email')) return 'Enter a valid email address';
    return '';
  }

  getPasswordError(): string {
    const ctrl = this.createForm.get('password');
    if (ctrl?.hasError('required')) return 'Password is required';
    if (ctrl?.hasError('minlength')) return 'Password must be at least 8 characters';
    return '';
  }
  getUsernameError(): string {
    const ctrl = this.createForm.get('username');
    if (ctrl?.hasError('required')) return 'Username is required';
    if (ctrl?.hasError('minlength')) return 'Username must be at least 3 characters';
    return '';
  }

  getPhoneError(): string {
    const ctrl = this.createForm.get('phoneNumber');
    if (ctrl?.hasError('required')) return 'Phone number is required';
    if (ctrl?.hasError('minlength')) return 'Enter a valid phone number';
    return '';
  }

  getConfirmPasswordError(): string {
    const ctrl = this.createForm.get('confirmPassword');
    if (ctrl?.hasError('required')) return 'Please confirm your password';
    if (this.createForm.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  }



  onSubmit(): void {
    if (this.createForm.valid) {
      this.isLoading.set(true);
      this.userService.createUser(
        this.createForm.get('email')?.value,
        this.createForm.get('password')?.value,
        this.createForm.get('username')?.value,
        this.createForm.get('phoneNumber')?.value
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
      this.createForm.markAllAsTouched();
    }
  }
}
