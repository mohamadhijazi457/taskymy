import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from './googleoauth.service';
import { Task } from '../utils/task.model';  // Import the Task interface
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleTasksService {
  private tasksApiUrl = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';

  constructor(private http: HttpClient, private authService: OAuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const googleAuthToken = this.authService.getGoogleAuthToken();
    if (!googleAuthToken) {
      throw new Error('No Google OAuth token found. User needs to log in.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${googleAuthToken}`,
    });
  }

// Fetching all tasks
getAllTasks(): Observable<Task[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task[]>(this.tasksApiUrl, { headers });
}

// Fetch a single task by ID
// This method is created to use it for example when updating a task
getTask(taskId: string): Observable<Task> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task>(`${this.tasksApiUrl}/${taskId}`, { headers });
}

// Creating a new task
createTask(taskTitle: string, description?: string, startDate?: string, endDate?: string): Observable<Task> {
    const headers = this.getAuthHeaders();
    const body = {
      title: taskTitle,
      notes: description || '',
      due: endDate || null,
      startDate: startDate || null,
      status: 'needsAction' // This will be updated as needed
    };
    return this.http.post<Task>(this.tasksApiUrl, body, { headers });
}

// Updating an existing task
updateTask(taskId: string, updatedTask: Partial<Task>): Observable<Task> {
    const headers = this.getAuthHeaders();
    const body = {
      title: updatedTask.title,
      notes: updatedTask.description,
      due: updatedTask.endDate,
      startDate: updatedTask.startDate,
      status: updatedTask.status
    };
    return this.http.patch<Task>(`${this.tasksApiUrl}/${taskId}`, body, { headers });
}

// Deleting a task
deleteTask(taskId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.tasksApiUrl}/${taskId}`, { headers });
  }
}
