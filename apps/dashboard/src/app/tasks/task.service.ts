import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  category: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  getTasks(): Observable<Task[]> {
    return from(
      fetch(this.apiUrl, {
        headers: this.getHeaders()
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json() as Promise<Task[]>;
      })
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return from(
      fetch(this.apiUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(task)
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json() as Promise<Task>;
      })
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return from(
      fetch(`${this.apiUrl}/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(task)
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json() as Promise<Task>;
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return from(
      fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return;
      })
    );
  }
}
