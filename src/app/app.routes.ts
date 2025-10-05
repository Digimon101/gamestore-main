import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Main } from './pages/main/main';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { HomeAdmin } from './pages/home-admin/home-admin';
import { ViewUser } from './pages/view-user/view-user';
import { authGuard, userGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // --- Grouped Routes (Protected Routes) ---
  // สามารถกำหนด canActivate ให้กับเส้นทางแม่
  {
    path: '', // เส้นทางแม่ไม่มี prefix
    canActivate: [authGuard], // ทุกเส้นทางย่อยต้อง Login ก่อน
    children: [
      { path: 'profile', component: Profile },
      { path: 'edit-profile', component: EditProfile },
      // ถ้ามีเส้นทางอื่นที่ Admin หรือ User เข้าได้
    ]
  },
  
  // --- Role-Based Routes (ต้องใช้ Guard เฉพาะทาง) ---
  { path: 'main', component: Main, canActivate: [userGuard] }, 
  { path: 'home-admin', component: HomeAdmin, canActivate: [adminGuard] },
  { path: 'view-user', component: ViewUser, canActivate: [adminGuard] },

  // --- Default Fallback ---
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
