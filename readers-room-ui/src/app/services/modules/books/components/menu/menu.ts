import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Token } from '../../../../services/token/token';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit, OnDestroy {
  connectedUsername = '';
  menuOpen = false;
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  // Close drawer on outside click or Escape
  @HostListener('document:keydown.escape')
  onEscape() {
    this.menuOpen = false;
  }

  private scheduleExpiryLogout() {
    const ms = this.token.msUntilExpiry();
    if (ms <= 0) {
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
    this.menuOpen = false;
    this.token.clear();
    this.router.navigate(['/login']);
  }
}
