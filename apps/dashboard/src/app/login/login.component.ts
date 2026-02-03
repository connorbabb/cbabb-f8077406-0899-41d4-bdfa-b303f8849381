import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Task Manager Login</h2>
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div *ngIf="error" class="text-red-600 text-sm">{{ error }}</div>

          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div class="mt-4 text-sm text-gray-600">
          <p>Test accounts:</p>
          <ul class="list-disc ml-5 mt-2">
            <li>owner@test.com / password123</li>
            <li>admin@test.com / password123</li>
            <li>viewer@test.com / password123</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => this.error = 'Invalid credentials'
    });
  }
}
