import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Api } from '../../apiFunctions/api';
import { register } from '../../apiFunctions/functions';
import { RegistrationRequest } from '../../apiFunctions/models/registration-request';

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
  errorMsg: string[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: Api
  ) { }

  register() {
    this.errorMsg = [];

    if (!this.registerReq.firstname) {
      this.errorMsg.push('First name is required.');
    }

    if (!this.registerReq.lastname) {
      this.errorMsg.push('Last name is required.');
    }

    if (!this.registerReq.email) {
      this.errorMsg.push('Email is required.');
    }

    if (!this.registerReq.password) {
      this.errorMsg.push('Password is required.');
    }

    if (this.registerReq.password && this.confirmPassword && this.registerReq.password !== this.confirmPassword) {
      this.errorMsg.push('Passwords do not match.');
    }

    if (this.errorMsg.length) {
      return;
    }

    register(this.http, this.api.rootUrl, {
      body: this.registerReq,
    }).subscribe({
      next: () => {
        this.router.navigate(['/activate-account']);
      },
      error: (err) => {
        const validationErrors = err?.error?.validationErrors;
        if (Array.isArray(validationErrors)) {
          this.errorMsg = validationErrors;
        } else if (validationErrors instanceof Set) {
          this.errorMsg = Array.from(validationErrors);
        } else if (typeof validationErrors === 'string') {
          this.errorMsg = [validationErrors];
        } else if (typeof err?.error?.errorMsg === 'string' && err.error.errorMsg) {
          this.errorMsg = [err.error.errorMsg];
        } else {
          this.errorMsg = ['Registration failed. Please try again.'];
        }
      }
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
}
