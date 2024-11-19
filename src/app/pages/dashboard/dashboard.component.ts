// dashboard.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WeatherComponent } from '../../components/weather-panel/weather-panel.component';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports:[RouterOutlet, WeatherComponent, UserInfoComponent, CommonModule]
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async onClick(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['./pages/login']);
  }
}
