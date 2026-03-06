import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubTask {
  subTaskId: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  taskId: string;
  createdAt: string;
}

export interface SubtaskCreateRequest {
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  taskId: string;
}

export interface StatusRequest {
  id: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private apiUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  getSubTasks(): Observable<SubTask[]> {
    return this.httpClient.get<SubTask[]>(`${this.apiUrl}/subtasks`);
  }

  getSubTasksByAssignedTo(assignedTo: string): Observable<SubTask[]> {
    const params = new HttpParams().set('assignedTo', assignedTo);
    return this.httpClient.get<SubTask[]>(`${this.apiUrl}/subtasks/assignedTo`, { params });
  }

  getSubTasksByTaskId(taskId: string): Observable<SubTask[]> {
    const params = new HttpParams().set('taskId', taskId);
    return this.httpClient.get<SubTask[]>(`${this.apiUrl}/subtasks/taskId`, { params });
  }

  deleteSubTaskById(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/subtasks/${id}`);
  }

  addSubTask(subtask: SubtaskCreateRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/subtasks`, subtask);
  }

  updateSubTask(id: string, subtask: SubtaskCreateRequest): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/subtasks/${id}`, subtask);
  }

  updateSubTaskStatus(updateRequest: StatusRequest): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/subtasks/status`, updateRequest);
  }
}
