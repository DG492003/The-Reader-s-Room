import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Api } from '../../api';
import { confirm } from '../../functions';
import { REGISTRATION_FLAG } from '../../guard/registration.guard';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css',
})
export class ActivateAccount implements OnInit {
  message = '';
  isOkay = true;
  submitted = false;
  otp = '';
  isLoading = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: Api
  ) { }

  ngOnInit() {
    // Clear the flag — page is now loaded legitimately
    sessionStorage.removeItem(REGISTRATION_FLAG);
  }

  confirmAccount(token: string) {
    if (!token || token.trim().length === 0) {
      this.message = 'Please enter the 6-digit code from your email.';
      this.isOkay = false;
      this.submitted = true;
      return;
    }

    this.isLoading = true;
    this.message = '';

    confirm(this.http, this.api.rootUrl, { token: token.trim() }).subscribe({
      next: () => {
        this.isOkay = true;
        this.submitted = true;
        this.isLoading = false;
      },
      error: () => {
        this.message = 'The code is invalid or has expired. Please request a new one.';
        this.isOkay = false;
        this.submitted = true;
        this.isLoading = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  tryAgain() {
    this.submitted = false;
    this.isOkay = true;
    this.message = '';
    this.otp = '';
  }
}
