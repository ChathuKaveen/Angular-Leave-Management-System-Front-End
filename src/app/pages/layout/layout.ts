import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { Logout } from '../../shared/logout';
import { SupervisorService } from '../../shared/Supervisor-Service/supervisor-service';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AdminService } from '../../shared/Admin-Service/admin-service';
import { LeaveService } from '../../shared/Leave-Services/leave-service';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive , JsonPipe , AsyncPipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit{
  currentRole: 'employee' | 'supervisor' | 'admin' = 'employee';
  currentAdminRole: 'employee' | 'supervisor' | 'admin' = 'employee';
  isSupervisor$!: Observable<boolean>
  isAdmin$!: Observable<boolean>
  constructor(private logoutSer:Logout , private router:Router , private supSer:SupervisorService , private adminSer:AdminService , private leaveSer:LeaveService){
    logoutSer.tokenValidity()
  }

  private refreshLeaves$ = new BehaviorSubject<void>(undefined);
    subLeaves$:Observable<any> = this.refreshLeaves$.pipe(switchMap(()=>this.leaveSer.getLeavesOfSubordinates()))
    pendingCount$:Observable<number> = this.subLeaves$.pipe(
      map((leaves: any[]) => leaves.filter(l => l.status === 'PENDING').length)
    );

  logout() {
    this.logoutSer.logout();
  }

  ngOnInit(): void {
    this.checkforSupRole()
    this.checkforAdminRole()
    const savedRole = localStorage.getItem('userRole') as  'employee' | 'supervisor' | 'admin';
    const savedAdminRole = localStorage.getItem('adminRole') as  'employee' | 'supervisor' | 'admin';
    if (savedRole) {
      this.currentRole = savedRole;
    }
    if (savedAdminRole) {
      this.currentAdminRole = savedAdminRole;
    }
  }

  checkforSupRole(){
    this.isSupervisor$ = this.supSer.checkIfSupervisor()
  }

  checkforAdminRole(){
    this.isAdmin$ = this.adminSer.checkIfAdmin();
  }

  switchRole(role: 'employee' | 'supervisor' | 'admin') {
    this.currentRole = role;
    this.currentAdminRole = role;
    
    // 3. Save the new role selection to localStorage
    localStorage.setItem('userRole', role);
    localStorage.setItem('adminRole', role);
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
