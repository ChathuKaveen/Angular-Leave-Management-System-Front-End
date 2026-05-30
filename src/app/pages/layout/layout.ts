import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { Logout } from '../../shared/logout';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor(private logoutSer:Logout){
    logoutSer.tokenValidity()
  }
  logout() {
    this.logoutSer.logout();
  }

}
