import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [AuthFormComponent, RouterOutlet, RouterLink, RouterLinkActive],
})
export class SignupComponent {

  constructor(private router: Router, private authService: AuthService) {}

  async onSignupSuccess(): Promise<void> {
    this.router.navigate(['/pages/dashboard']);
  }
}
