import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Token } from '../../../../services/token/token';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  connectedUsername = '';

  constructor(
    private router: Router,
    private token: Token
  ) {
    this.connectedUsername = this.token.getDisplayName();
  }

  logout() {
    this.token.clear();
    this.router.navigate(['/login']);
  }
}
