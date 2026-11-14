import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/employee_components/dashboard/dashboard';
import { Layout } from './pages/layout/layout';
import { authGuardGuard } from './shared/auth-guard-guard';
import { ApplyLeave } from './pages/employee_components/apply-leave/apply-leave';
import { MyLeaveHistory } from './pages/employee_components/my-leave-history/my-leave-history';
import { PendingRequests } from './pages/sup_components/pending-requests/pending-requests';
import { TeamLeaveHistory } from './pages/sup_components/team-leave-history/team-leave-history';

export const routes: Routes = [
    {
        path:'login' , component: Login
    },
    {   
        path:'' , component: Layout , children : [
            {path:'dashboard' , component:Dashboard ,canActivate:[authGuardGuard]},
            {path:'apply_leave' , component:ApplyLeave ,canActivate:[authGuardGuard]},
            {path:'my_leave_history' , component:MyLeaveHistory ,canActivate:[authGuardGuard]},
            {path:'pending_requests' , component:PendingRequests ,canActivate:[authGuardGuard]},
            {path:'team_leave_history' , component:TeamLeaveHistory ,canActivate:[authGuardGuard]},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ] 
    },
    {   
        path:'' , redirectTo: 'login' , pathMatch: 'full'
    },
    
    {   
        path:'**' , component:Login
    }
    ];
