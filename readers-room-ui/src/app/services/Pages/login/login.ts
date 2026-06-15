import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../api';
import { authenticate } from '../../functions';
import { AuthRequest } from '../../models';
import { Token } from '../../services/token/token';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  authRequest: AuthRequest = { email: '', password: '' };

  fieldErrors: Record<string, string> = {};
  serverError = '';
  sessionExpired = false;
  showPassword = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private api: Api,
    private token: Token
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['reason'] === 'session_expired') {
        this.sessionExpired = true;
        // Clean the URL so refreshing doesn't re-show the banner
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true
        });
      }
    });
  }

  clearFieldError(field: string) {
    delete this.fieldErrors[field];
    this.serverError = '';
  }

  private validate(): boolean {
    this.fieldErrors = {};

    if (!this.authRequest.email?.trim()) {
      this.fieldErrors['email'] = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.authRequest.email.trim())) {
      this.fieldErrors['email'] = 'Please enter a valid email address.';
    }

    if (!this.authRequest.password) {
      this.fieldErrors['password'] = 'Password is required.';
    }

    return Object.keys(this.fieldErrors).length === 0;
  }

  login() {
    this.serverError = '';
    this.sessionExpired = false;

    if (!this.validate()) {
      return;
    }

    authenticate(this.http, this.api.rootUrl, { body: this.authRequest })
      .subscribe({
        next: (res: any) => {
          const token = res.body?.token;
          if (token) {
            this.token.setToken(token);
            this.router.navigate(['books']);
          } else {
            this.serverError = 'Login failed. Please try again.';
          }
        },
        error: (err: any) => {
          const validationErrors = err?.error?.validationErrors;
          if (Array.isArray(validationErrors) && validationErrors.length) {
            this.serverError = validationErrors.join(' ');
          } else if (typeof err?.error?.error === 'string' && err.error.error) {
            this.serverError = err.error.error;
          } else {
            this.serverError = 'Invalid email or password.';
          }
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
