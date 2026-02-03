import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
      { path: 'tasks', loadComponent: () => import('./tasks/task-list/task-list.component').then(m => m.TaskListComponent) },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ])
  ],
};
