import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  type: number; // 0 = user, 1 = admin
}

@Component({
  selector: 'app-home-admin',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss'
})
export class HomeAdmin implements OnInit {
  currentAdmin: User | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // ตรวจสอบว่าเป็น admin หรือไม่
    this.checkAdminAuthentication();
  }

  // ตรวจสอบ Admin Authentication
  checkAdminAuthentication() {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      // ถ้าไม่มี user ใน localStorage -> ไปหน้า login
      console.log('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.currentAdmin = JSON.parse(userStr);
      
      // ตรวจสอบว่าเป็น admin (type = 1) หรือไม่
      if (this.currentAdmin && this.currentAdmin.type !== 1) {
        // ถ้าเป็น user ธรรมดา (type = 0) ไม่ควรอยู่หน้านี้
        console.log('Regular user detected, redirecting to main page');
        this.router.navigate(['/main']);
        return;
      }

      console.log('Admin authenticated:', this.currentAdmin);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }

  // ฟังก์ชันไปหน้า Profile
  onProfile() {
    this.router.navigate(['/profile']);
    console.log('Admin is navigating to /profile');
  }

  // ฟังก์ชันไปหน้า View User
  onViewUsers() {
    this.router.navigate(['/view-user']);
    console.log('Admin is navigating to /view-user');
  }

  // ฟังก์ชัน Logout
  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    console.log('Admin logged out');
  }

  // ฟังก์ชันสำหรับจัดการผู้ใช้ (ตัวอย่าง)
  onManageUsers() {
    console.log('Managing users...');
    this.router.navigate(['/view-user']);
  }

  // ฟังก์ชันสำหรับจัดการเกม (ตัวอย่าง)
  onManageGames() {
    console.log('Managing games...');
    // เพิ่ม route สำหรับจัดการเกม
  }

  // ฟังก์ชันสำหรับดูสถิติ (ตัวอย่าง)
  onViewStatistics() {
    console.log('Viewing statistics...');
    // เพิ่ม route สำหรับดูสถิติ
  }
}