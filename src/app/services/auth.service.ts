import { Injectable, signal } from '@angular/core';
import { UserInfo, UserToken } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 *
 */
@Injectable({
 providedIn: 'root',
})
export class AuthService {
 userInfo = signal<UserInfo | null>(null);
 isLoggedIn = signal<boolean>(false);
 constructor(private http: HttpClient) {
  this.userInfo.set(null);
 }
 register(name: string, surname: string, email: string, password: string): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
   this.http.post<UserToken>(environment.apiUrl + '/auth/register', { name, surname, email, password }).subscribe({
    next: userToken => {
     this.userInfo.set(userToken.user);
     localStorage.setItem(environment.tokenStorageKey, userToken.access_token);
     this.isLoggedIn.set(true);
     resolve(userToken.user);
    },
    error: error => reject(error),
   });
  });
 }
 login(user: UserInfo): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
   this.http.post<UserToken>(environment.apiUrl + '/auth/login', user).subscribe({
    next: userToken => {
     this.userInfo.set(userToken.user);
     localStorage.setItem(environment.tokenStorageKey, userToken.access_token);
     this.isLoggedIn.set(true);
     resolve(userToken.user);
    },
    error: error => reject(error),
   });
  });
 }
 logout(): Promise<void> {
  return new Promise((resolve, reject) => {
   this.http.post<void>(environment.apiUrl + '/auth/logout', {}).subscribe({
    next: () => {
     this.userInfo.set(null);
     localStorage.removeItem(environment.tokenStorageKey);
     this.isLoggedIn.set(false);
     resolve();
    },
    error: error => reject(error),
   });
  });
 }

 autoLogin(): Promise<void> {
  return new Promise((resolve, reject) => {
   const token = localStorage.getItem(environment.tokenStorageKey);
   if (token) {
    this.isLoggedIn.set(true);
    resolve();
   } else {
    reject();
   }
  });
 }

 /**
  * Kullanıcının oturum durumunu kontrol eder
  * @returns Kullanıcı giriş yapmışsa true, aksi halde false
  */
 isAuthenticated(): boolean {
  const token = localStorage.getItem(environment.tokenStorageKey);
  const hasToken = !!token;
  const isLoggedInSignal = this.isLoggedIn();

  // Token varsa ve signal true ise authenticated
  if (hasToken && isLoggedInSignal) {
   return true;
  }

  // Token yoksa veya signal false ise authenticated değil
  if (!hasToken) {
   this.isLoggedIn.set(false);
   return false;
  }

  // Sadece token varsa ama signal false ise, signal'ı güncelle
  if (hasToken && !isLoggedInSignal) {
   this.isLoggedIn.set(true);
   return true;
  }

  return false;
 }

 /**
  * Mevcut token'ı döndürür
  * @returns JWT token veya null
  */
 getToken(): string | null {
  return localStorage.getItem(environment.tokenStorageKey);
 }
}
