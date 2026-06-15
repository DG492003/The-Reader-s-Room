import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Token } from '../../../../services/token/token';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit, OnDestroy {
  connectedUsername = '';
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private token: Token
  ) {
    this.connectedUsername = this.token.getDisplayName();
  }

  ngOnInit() {
    this.scheduleExpiryLogout();
  }

  ngOnDestroy() {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
  }

  private scheduleExpiryLogout() {
    const ms = this.token.msUntilExpiry();
    if (ms <= 0) {
      // Already expired
      this.sessionExpiredLogout();
      return;
    }
    this.expiryTimer = setTimeout(() => this.sessionExpiredLogout(), ms);
  }

  private sessionExpiredLogout() {
    this.token.clear();
    this.router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
  }

  logout() {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.token.clear();
    this.router.navigate(['/login']);
  }
}
