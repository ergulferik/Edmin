import { Injectable, signal, inject } from '@angular/core';
import { UserInfo, UserToken } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PermissionService } from './permission.service';
import { Router } from '@angular/router';
import { DcToastService } from 'dc-toast-ng';

/**
 * Authentication service
 * @description Kullanıcı kimlik doğrulama ve oturum yönetimi
 */
@Injectable({
 providedIn: 'root',
})
export class AuthService {
 userInfo = signal<UserInfo | null>(null);
 isLoggedIn = signal<boolean>(false);
 isLoggingTryed = signal<boolean>(false);
 private permissionService = inject(PermissionService);
 private router = inject(Router);
 private toast = inject(DcToastService);
 constructor(private http: HttpClient) {
  this.userInfo.set(null);
 }
 /**
  * Kullanıcı kaydı yapar
  * @param name - Kullanıcı adı
  * @param surname - Kullanıcı soyadı
  * @param email - Kullanıcı e-posta
  * @param password - Kullanıcı şifresi
  * @returns Kullanıcı bilgileri
  */
 register(name: string, surname: string, email: string, password: string): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
   this.http.post<UserToken>(environment.apiUrl + '/auth/register', { name, surname, email, password }).subscribe({
    next: async userToken => {
     this.isLoggingTryed.set(true);
     this.userInfo.set(userToken.user);
     localStorage.setItem(environment.tokenStorageKey, userToken.access_token);
     this.isLoggedIn.set(true);
     // Kullanıcı izinlerini yükle
     await this.permissionService.loadUserPermissions(userToken.user);
     resolve(userToken.user);
    },
    error: error => {
     this.isLoggingTryed.set(true);
     reject(error);
    },
   });
  });
 }
 /**
  * Kullanıcı girişi yapar
  * @param user - Kullanıcı bilgileri (email ve password)
  * @returns Kullanıcı bilgileri
  */
 login(user: UserInfo): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
   this.http.post<UserToken>(environment.apiUrl + '/auth/login', user).subscribe({
    next: async userToken => {
     this.isLoggingTryed.set(true);
     this.userInfo.set(userToken.user);
     localStorage.setItem(environment.tokenStorageKey, userToken.access_token);
     this.isLoggedIn.set(true);
     // Kullanıcı izinlerini yükle
     await this.permissionService.loadUserPermissions(userToken.user);
     resolve(userToken.user);
    },
    error: error => {
     this.isLoggingTryed.set(true);
     this.toast.create({
      position: 'bottom-center',
      content: error.error.message || 'Giriş yapılırken hata oluştu',
      type: 'error',
      time: 3,
     });
     reject(error);
    },
   });
  });
 }
 /**
  * Kullanıcı çıkışı yapar
  * @returns Promise<void>
  */
 logout(): Promise<void> {
  return new Promise((resolve, reject) => {
   this.http.post<void>(environment.apiUrl + '/auth/logout', {}).subscribe({
    next: async () => {
     this.userInfo.set(null);
     localStorage.removeItem(environment.tokenStorageKey);
     this.isLoggedIn.set(false);
     // İzinleri temizle
     await this.permissionService.loadUserPermissions(null);
     resolve();
    },
    error: error => reject(error),
   });
  });
 }

 /**
  * Otomatik giriş yapar (token varsa)
  * @returns Promise<void>
  */
 autoLogin(): Promise<void> {
  return new Promise((resolve, reject) => {
   const token = this.getToken();
   if (token) {
    // Token varsa kullanıcı bilgilerini backend'den al
    this.http.post<UserInfo>(`${environment.apiUrl}/auth/auto-login`, { access_token: token }).subscribe({
     next: async userInfo => {
      this.isLoggingTryed.set(true);
      this.userInfo.set(userInfo);
      this.isLoggedIn.set(true);
      await this.permissionService.loadUserPermissions(userInfo);
      this.router.navigate(['/class-operations']);

      resolve();
     },
     error: () => {
      // Token geçersiz, temizle
      this.isLoggingTryed.set(true);
      localStorage.removeItem(environment.tokenStorageKey);
      this.isLoggedIn.set(false);
      this.userInfo.set(null);
      this.toast.create({
       position: 'bottom-center',
       content: 'Oturumunuzun süresi doldu, lütfen tekrar giriş yapınız',
       type: 'error',
       time: 3,
      });
      reject();
     },
    });
   } else {
    reject();
   }
  });
 }

 /**
  * Kullanıcının oturum durumunu kontrol eder
  * @returns Kullanıcı giriş yapmışsa true, aksi halde false
  */
 async isAuthenticated(): Promise<boolean> {
  const token = this.getToken();
  const hasToken = !!token;

  if (!this.isLoggingTryed()) {
   if (hasToken) {
    try {
     await this.autoLogin();
     return true;
    } catch {
     return false;
    }
   } else {
    return false;
   }
  } else {
   return this.isLoggedIn();
  }
 }

 /**
  * Mevcut token'ı döndürür
  * @returns JWT token veya null
  */
 getToken(): string | null {
  return localStorage.getItem(environment.tokenStorageKey);
 }
}
