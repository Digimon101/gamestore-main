import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule // ✅ เพิ่ม HttpClientModule
  ],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit {
  user: any = null;
  profileForm!: FormGroup;
  selectedFile: File | null = null;

  previewUrl: string | null = null; // รูปที่เลือกใหม่
  currentImageUrl: string | null = null; // รูปเดิมจาก backend

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    // รูปเดิมจาก backend
    this.currentImageUrl = this.user.image
      ? this.user.image.startsWith('http')
        ? this.user.image
        : `http://localhost:3000${this.user.image}`
      : null;

    this.initializeForm();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }

  // เลือกรูปใหม่
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select an image file', 'Close', { duration: 3000 });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Image size must be less than 5MB', 'Close', { duration: 3000 });
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string; // แสดง preview
      };
      reader.readAsDataURL(file);
    }
  }

  // ลบ preview กลับไปใช้รูปเดิม
  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  // บันทึก
  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('id', this.user.id);
    formData.append('name', this.profileForm.value.name);
    formData.append('email', this.profileForm.value.email);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http.put('http://localhost:3000/update-profile', formData)
      .subscribe({
        next: (res: any) => {
          this.authService.setUser(res.user);
          this.currentImageUrl = res.user.image
            ? `http://localhost:3000${res.user.image}`
            : null;
          this.previewUrl = null;
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Update profile error:', err);
          this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
        }
      });
  }

  // สำหรับ template: ใช้รูป preview ก่อน ถ้าไม่มี ใช้ currentImageUrl
  get displayedImage(): string | null {
    return this.previewUrl || this.currentImageUrl;
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }

  onDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.authService.logout();
      this.snackBar.open('Account deleted successfully', 'Close', { duration: 3000 });
    }
  }
}
