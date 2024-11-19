import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './utils/auth.guard';

// Defining the routes
export const routes: Routes = [
  { path: 'pages/login', component: LoginComponent },
  { path: 'pages/signup', component: SignupComponent },
  {
    path: 'pages/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/pages/login', pathMatch: 'full' },
];
