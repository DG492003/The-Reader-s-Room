import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Api } from '../../apiFunctions/api';
import { authenticate } from '../../apiFunctions/functions';
import { AuthRequest } from '../../apiFunctions/models';
import { Token } from '../../services/token/token';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  authRequest: AuthRequest = { email: '', password: '' };
  errorMsg: string[] = [];
  showPassword = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: Api,
    private token: Token
  ) { }

  login() {
    this.errorMsg = [];

    authenticate(this.http, this.api.rootUrl, { body: this.authRequest })
      .subscribe({
        next: (res) => {
          const token = res.body?.token;

          if (token) {
            this.token.setToken(token);
            this.token.setUsername(this.authRequest.email.trim());
            this.router.navigate(['books']);
          } else {
            this.errorMsg.push('Login failed');
          }
        },
        error: (err) => {
          if (err.error.validationErrors) {
            this.errorMsg = err.error.validationErrors;
          } else {
            this.errorMsg.push(err.error.error);
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
