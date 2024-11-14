import { Component } from '@angular/core';
import { GoogleTasksService } from '../../services/tasks.service';  // Import GoogleTasksService
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-tasks-component',
  standalone: true,
  imports: [],
  templateUrl: './tasks-component.component.html',
  styleUrl: './tasks-component.component.css'
})

export class TasksComponentComponent {
  tasks: any;
  ;
  
  constructor(private googletasksService: GoogleTasksService, private authService: AuthService){}

}
