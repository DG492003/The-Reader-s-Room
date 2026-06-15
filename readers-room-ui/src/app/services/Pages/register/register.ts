import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Api } from '../../api';
import { register } from '../../functions';
import { RegistrationRequest } from '../../models/registration-request';
import { REGISTRATION_FLAG } from '../../guard/registration.guard';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerReq: RegistrationRequest = {
    email: '',
    firstname: '',
    lastname: '',
    password: ''
  };
  confirmPassword = '';

  // Per-field inline errors
  fieldErrors: Record<string, string> = {};

  // Server-side / general errors shown at the top
  serverError = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: Api
  ) { }

  // Clear a field's error as the user types
  clearFieldError(field: string) {
    delete this.fieldErrors[field];
  }

  private validate(): boolean {
    this.fieldErrors = {};

    if (!this.registerReq.firstname?.trim()) {
      this.fieldErrors['firstname'] = 'First name is required.';
    }

    if (!this.registerReq.lastname?.trim()) {
      this.fieldErrors['lastname'] = 'Last name is required.';
    }

    if (!this.registerReq.email?.trim()) {
      this.fieldErrors['email'] = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerReq.email.trim())) {
      this.fieldErrors['email'] = 'Please enter a valid email address.';
    }

    if (!this.registerReq.password) {
      this.fieldErrors['password'] = 'Password is required.';
    } else if (this.registerReq.password.length < 8) {
      this.fieldErrors['password'] = 'Password must be at least 8 characters.';
    }

    if (!this.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Please confirm your password.';
    } else if (this.registerReq.password && this.registerReq.password !== this.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Passwords do not match.';
    }

    return Object.keys(this.fieldErrors).length === 0;
  }

  register() {
    this.serverError = '';

    if (!this.validate()) {
      return;
    }

    register(this.http, this.api.rootUrl, {
      body: this.registerReq,
    }).subscribe({
      next: () => {
        sessionStorage.setItem(REGISTRATION_FLAG, 'true');
        this.router.navigate(['/activate-account']);
      },
      error: (err: any) => {
        const validationErrors = err?.error?.validationErrors;
        if (Array.isArray(validationErrors) && validationErrors.length) {
          this.serverError = validationErrors.join(' ');
        } else if (validationErrors instanceof Set && validationErrors.size) {
          this.serverError = Array.from(validationErrors).join(' ');
        } else if (typeof validationErrors === 'string' && validationErrors) {
          this.serverError = validationErrors;
        } else if (typeof err?.error?.errorMsg === 'string' && err.error.errorMsg) {
          this.serverError = err.error.errorMsg;
        } else {
          this.serverError = 'Registration failed. Please try again.';
        }
      }
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
