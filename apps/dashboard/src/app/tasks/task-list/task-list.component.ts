import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../task.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

interface User {
  id: string;
  email: string;
  role: string;
  organizationId: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Task Manager</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{{ user?.email }} ({{ user?.role }})</span>
            <button 
              (click)="logout()"
              class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Create Task Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Create New Task</h2>
          <form (ngSubmit)="createTask()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                [(ngModel)]="newTask.title"
                name="title"
                placeholder="Task title"
                class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                [(ngModel)]="newTask.category"
                name="category"
                class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <textarea
              [(ngModel)]="newTask.description"
              name="description"
              placeholder="Description"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Task
            </button>
          </form>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Search tasks..."
              class="px-3 py-2 border rounded-md flex-1 min-w-64"
            />
            <select [(ngModel)]="filterCategory" class="px-3 py-2 border rounded-md">
              <option value="">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
            <select [(ngModel)]="filterStatus" class="px-3 py-2 border rounded-md">
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        <!-- Task List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let task of filteredTasks" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold">{{ task.title }}</h3>
              <span 
                class="px-2 py-1 text-xs rounded"
                [ngClass]="{
                  'bg-yellow-100 text-yellow-800': task.status === 'TODO',
                  'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-800': task.status === 'DONE'
                }"
              >
                {{ task.status.replace('_', ' ') }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3">{{ task.description }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">{{ task.category }}</span>
              <div class="flex gap-2">
                <select
                  [value]="task.status"
                  (change)="updateTaskStatus(task.id, $event)"
                  class="text-xs px-2 py-1 border rounded"
                  [disabled]="user?.role === 'VIEWER'"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                <button
                  (click)="deleteTask(task.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                  [disabled]="user?.role === 'VIEWER'"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredTasks.length === 0" class="text-center text-gray-500 py-12">
          No tasks found
        </div>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask = { title: '', description: '', category: 'Work' };
  searchTerm = '';
  filterCategory = '';
  filterStatus = '';
  user: User | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.currentUser;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  createTask() {
    this.taskService.createTask(this.newTask).subscribe(() => {
      this.newTask = { title: '', description: '', category: 'Work' };
      this.loadTasks();
    });
  }

  updateTaskStatus(id: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value as 'TODO' | 'IN_PROGRESS' | 'DONE';
    this.taskService.updateTask(id, { status }).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: string) {
    if (confirm('Delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.filterCategory || task.category === this.filterCategory;
      const matchesStatus = !this.filterStatus || task.status === this.filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }
}
