import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly tokenKey = 'token';
  private readonly usernameKey = 'username';

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    // Extract fullName from JWT payload and store it
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.fullName) {
        localStorage.setItem(this.usernameKey, payload.fullName);
      }
    } catch { /* ignore malformed token */ }
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  setUsername(username: string) {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string {
    return localStorage.getItem(this.usernameKey) || 'Guest';
  }

  getDisplayName(): string {
    const storedName = this.getUsername();

    if (!storedName || storedName === 'Guest') {
      return 'Guest';
    }

    const normalizedName = storedName
      .trim()
      .split('@')[0]
      .replace(/[_ .-]+/g, ' ')
      .trim();

    const firstName = normalizedName.split(/\s+/)[0];

    return firstName
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
      : 'Guest';
  }

  /** Decodes JWT payload and checks if it is expired */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry: number = payload.exp;
      if (!expiry) return false;
      // exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= expiry * 1000;
    } catch {
      // malformed token — treat as expired
      return true;
    }
  }

  /** Returns how many milliseconds until the token expires (negative if already expired) */
  msUntilExpiry(): number {
    const token = this.getToken();
    if (!token) return -1;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 - Date.now() : -1;
    } catch {
      return -1;
    }
  }

  clear() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
  }
}
