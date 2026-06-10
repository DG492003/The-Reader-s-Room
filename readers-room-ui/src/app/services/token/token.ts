import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly tokenKey = 'token';
  private readonly usernameKey = 'username';

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
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

  clear() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
  }
}
