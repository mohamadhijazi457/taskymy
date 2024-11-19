import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  // Defining signals to hold dynamic data
  avatar = signal<string>('./assets/man.jpg'); // Default avatar
  isAvatarSelectionVisible = signal<boolean>(false); // State for avatar selection visibility
  userEmail = signal<string | null>(null);

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const email = this.auth.getUserEmailFromToken();
    this.userEmail.set(email);
  }
  // Method to toggle avatar selection display
  toggleAvatarSelection() {
    this.isAvatarSelectionVisible.set(!this.isAvatarSelectionVisible());
  }

  // Method to select a new avatar
  selectAvatar(newAvatar: string) {
    this.avatar.set(newAvatar); // Update the avatar signal
    this.toggleAvatarSelection(); // Hide the avatar selection
  }
}
