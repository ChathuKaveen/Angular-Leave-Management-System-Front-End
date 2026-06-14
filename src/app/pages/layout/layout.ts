import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { Logout } from '../../shared/logout';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit{
  currentRole: 'employee' | 'supervisor' | 'admin' = 'employee';
  constructor(private logoutSer:Logout , private router:Router){
    logoutSer.tokenValidity()
  }
  logout() {
    this.logoutSer.logout();
  }

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole') as  'employee' | 'supervisor' | 'admin';
    if (savedRole) {
      this.currentRole = savedRole;
    }
  }

  switchRole(role: 'employee' | 'supervisor' | 'admin') {
    this.currentRole = role;
    
    // 3. Save the new role selection to localStorage
    localStorage.setItem('userRole', role);
    switch(role){
      case 'employee':
        this.currentRole = role
        this.router.navigateByUrl('dashboard')
        break
      case 'supervisor':
        this.currentRole = role
        this.router.navigateByUrl('/pending_requests')
        break
      case 'admin':
        this.currentRole = role
        this.router.navigateByUrl('/dashboard')
        break
    }

  }


}
