import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// กำหนด interface User ถ้ายังไม่มี import
interface User {
  id: number;
  name: string;
  email: string;
  type: number; // 0 = user, 1 = admin
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class Main implements OnInit {
  currentUser: User | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // ดึง user จาก AuthService
    this.currentUser = this.authService.currentUserValue;

    // ตรวจสอบว่า login แล้วหรือยัง
    if (!this.authService.isAuthenticated()) {
      console.log('Not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // ตรวจสอบว่าเป็น user ธรรมดา
    if (!this.authService.isRegularUser()) {
      console.log('Not a regular user, redirecting...');
      this.authService.redirectByUserType();
      return;
    }

    console.log('User authenticated:', this.currentUser);
  }

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onLogout() {
    this.authService.logout();
  }

  onBuyGame(gameId: number) {
    console.log('Buying game:', gameId);
  }
}
