import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  taskId: string;
  name: string;
  description: string;
  status: string;
  assignedTo: string;
}

export interface TaskCreateRequest {
  name: string;
  description: string;
  status: string;
  assignedTo: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  getTasksByAssignedTo(assignedTo: string): Observable<Task[]> {
    const params = new HttpParams().set('assignedTo', assignedTo);
    return this.httpClient.get<Task[]>(`${this.apiUrl}/tasks/assignedTo`, { params });
  }

  getTaskByTaskId(taskId: string): Observable<Task> {
    const params = new HttpParams().set('taskId', taskId);
    return this.httpClient.get<Task>(`${this.apiUrl}/tasks/taskId`, { params });
  }

  deleteTaskById(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }

  addTask(task: TaskCreateRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(id: string, task: TaskCreateRequest): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/tasks/${id}`, task);
  }
}
