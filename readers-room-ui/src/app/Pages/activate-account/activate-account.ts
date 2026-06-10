import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Api } from '../../apiFunctions/api';
import { confirm } from '../../apiFunctions/functions';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css',
})
export class ActivateAccount {
  message = '';
  isOkay = true;
  submitted = false;
  otp = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: Api
  ) { }

  confirmAccount(token: string) {
    confirm(this.http, this.api.rootUrl, {
      token,
    }).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted = true;
      },
      error: () => {
        this.message = 'Token has been expired or invalid';
        this.submitted = false;
        this.isOkay = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }
}
