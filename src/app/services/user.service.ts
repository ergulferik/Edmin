import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../models/user.model';
import { environment } from '../../environments/environment';
import { DcToastService } from 'dc-toast-ng';
import { tap, catchError, throwError, firstValueFrom } from 'rxjs';

/**
 * User service
 * @description Rol yönetimi için service sınıfı - Signal tabanlı state yönetimi
 */
@Injectable({ providedIn: 'root' })
export class UserService {
 private readonly apiUrl = `${environment.apiUrl}/users`;

 // State signals
 private _users = signal<UserInfo[]>([]);
 private _selectedUserId = signal<string | null>(null);
 private _loading = signal<boolean>(false);
 private _error = signal<string | null>(null);

 // Public readonly signals
 users = this._users.asReadonly();
 selectedUserId = this._selectedUserId.asReadonly();
 loading = this._loading.asReadonly();
 error = this._error.asReadonly();

 // Computed signals
 selectedUser = computed(() => {
  const userId = this._selectedUserId();
  if (!userId) return null;
  return this._users().find(u => u.id === userId) || null;
 });

 constructor(
  private http: HttpClient,
  private toast: DcToastService
 ) {}

 /**
  * Tüm kullanıcıları getirir
  * @returns Kullanıcılar promise
  */
 getUsers(): Promise<UserInfo[]> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.get<UserInfo[]>(this.apiUrl).pipe(
    tap(users => {
     this._users.set(users);
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Kullanıcılar yüklenirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Kullanıcılar yüklenirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * ID'ye göre kullanıcı getirir
  * @param userId - Kullanıcı ID
  * @returns Kullanıcı promise
  */
 getUserById(userId: string): Promise<UserInfo> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.get<UserInfo>(`${this.apiUrl}/${userId}`).pipe(
    tap(user => {
     this._users.update(users => {
      const index = users.findIndex(u => u.id === userId);
      if (index >= 0) {
       users[index] = user;
       return [...users];
      }
      return [...users, user];
     });
     this._selectedUserId.set(userId);
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Kullanıcı yüklenirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Kullanıcı yüklenirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * Yeni kullanıcı oluşturur
  * @param user - Oluşturulacak kullanıcı
  * @returns Oluşturulan kullanıcı promise
  */
 createUser(user: Partial<UserInfo>): Promise<UserInfo> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.post<UserInfo>(this.apiUrl, user).pipe(
    tap(newUser => {
     this._users.update(users => [...users, newUser]);
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Rol oluşturulurken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Rol oluşturulurken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * Kullanıcıyı günceller
  * @param userId - Güncellenecek kullanıcı ID
  * @param user - Güncellenecek kullanıcı bilgileri
  * @returns Güncellenmiş kullanıcı promise
  */
 updateUser(userId: string, user: Partial<UserInfo>): Promise<UserInfo> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.put<UserInfo>(`${this.apiUrl}/${userId}`, user).pipe(
    tap(updatedUser => {
     this._users.update(users => users.map(u => (u.id === userId ? updatedUser : u)));
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Kullanıcı güncellenirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Kullanıcı güncellenirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * Kullanıcıyı siler
  * @param userId - Silinecek kullanıcı ID
  * @returns Boş promise
  */
 deleteUser(userId: string): Promise<void> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
    tap(() => {
     this._users.update(users => users.filter(u => u.id !== userId));
     this._loading.set(false);
     if (this._selectedUserId() === userId) {
      this._selectedUserId.set(null);
     }
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Rol silinirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Rol silinirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }
}
