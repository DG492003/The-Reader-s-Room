import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu } from '../../components/menu/menu';

@Component({
  selector: 'app-main',
  imports: [RouterModule, Menu],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

}
