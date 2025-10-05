import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

interface Game {
  id: number;
  title: string;
  genres: string[];
  imageUrl?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  user: any = null;
  userGames: Game[] = [
    { id: 1, title: 'The Legend of Zelda', genres: ['Action', 'Adventure', 'RPG'] },
    { id: 2, title: 'Final Fantasy VII', genres: ['RPG', 'Adventure'] },
    { id: 3, title: 'God of War', genres: ['Action', 'Adventure'] },
    { id: 4, title: 'Elden Ring', genres: ['RPG', 'Action', 'Open World'] },
    { id: 5, title: 'Cyberpunk 2077', genres: ['RPG', 'Action', 'Sci-Fi'] }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ดึงข้อมูล user จาก AuthService
    this.user = this.authService.currentUserValue;
    
    if (!this.user) {
      console.warn('No user data found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  onEdit(): void {
    this.router.navigate(['/edit-profile']);
    console.log('Navigating to edit profile');
  }

  onSignOut(): void {
    this.authService.logout();
    console.log('User signed out');
  } 

  onDownload(game: Game): void {
    console.log('Downloading game:', game.title);
    // TODO: เพิ่ม logic การดาวน์โหลดเกม
    alert(`Starting download: ${game.title}`);
  }

  getGenresText(genres: string[]): string {
    return genres.join(', ');
  }
}