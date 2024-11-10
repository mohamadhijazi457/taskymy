import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './auth.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'taskManager';
  constructor(private authService: AuthService) {
    
  }
}

