import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRole } from '../models/user.model';
import { environment } from '../../environments/environment';
import { DcToastService } from 'dc-toast-ng';
import { tap, catchError, throwError, firstValueFrom } from 'rxjs';

/**
 * Role service
 * @description Rol yönetimi için service sınıfı - Signal tabanlı state yönetimi
 */
@Injectable({ providedIn: 'root' })
export class RoleService {
 private readonly apiUrl = `${environment.apiUrl}/roles`;

 // State signals
 private _roles = signal<IRole[]>([]);
 private _selectedRoleId = signal<string | null>(null);
 private _loading = signal<boolean>(false);
 private _error = signal<string | null>(null);

 // Public readonly signals
 roles = this._roles.asReadonly();
 selectedRoleId = this._selectedRoleId.asReadonly();
 loading = this._loading.asReadonly();
 error = this._error.asReadonly();

 // Computed signals
 selectedRole = computed(() => {
  const roleId = this._selectedRoleId();
  if (!roleId) return null;
  return this._roles().find(r => r.id === roleId) || null;
 });

 activeRoles = computed(() => {
  return this._roles().filter(role => role.isActive === true);
 });

 constructor(
  private http: HttpClient,
  private toast: DcToastService
 ) {}

 /**
  * Tüm rolleri getirir
  * @returns Roller promise
  */
 getRoles(): Promise<IRole[]> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.get<IRole[]>(this.apiUrl).pipe(
    tap(roles => {
     this._roles.set(roles);
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Roller yüklenirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Roller yüklenirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * ID'ye göre rol getirir
  * @param roleId - Rol ID
  * @returns Rol promise
  */
 getRoleById(roleId: string): Promise<IRole> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.get<IRole>(`${this.apiUrl}/${roleId}`).pipe(
    tap(role => {
     this._roles.update(roles => {
      const index = roles.findIndex(r => r.id === roleId);
      if (index >= 0) {
       roles[index] = role;
       return [...roles];
      }
      return [...roles, role];
     });
     this._selectedRoleId.set(roleId);
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Rol yüklenirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Rol yüklenirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * Yeni rol oluşturur
  * @param role - Oluşturulacak rol
  * @returns Oluşturulan rol promise
  */
 createRole(role: Partial<IRole>): Promise<IRole> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.post<IRole>(this.apiUrl, role).pipe(
    tap(newRole => {
     this._roles.update(roles => [...roles, newRole]);
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
  * Rolü günceller
  * @param roleId - Güncellenecek rol ID
  * @param role - Güncellenecek rol bilgileri
  * @returns Güncellenmiş rol promise
  */
 updateRole(roleId: string, role: Partial<IRole>): Promise<IRole> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.put<IRole>(`${this.apiUrl}/${roleId}`, role).pipe(
    tap(updatedRole => {
     this._roles.update(roles => roles.map(r => (r.id === roleId ? updatedRole : r)));
     this._loading.set(false);
    }),
    catchError(error => {
     this._loading.set(false);
     this._error.set(error.message || 'Rol güncellenirken hata oluştu');
     this.toast.create({
      position: 'bottom-center',
      content: 'Rol güncellenirken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }

 /**
  * Rolü siler
  * @param roleId - Silinecek rol ID
  * @returns Boş promise
  */
 deleteRole(roleId: string): Promise<void> {
  this._loading.set(true);
  this._error.set(null);

  return firstValueFrom(
   this.http.delete<void>(`${this.apiUrl}/${roleId}`).pipe(
    tap(() => {
     this._roles.update(roles => roles.filter(r => r.id !== roleId));
     this._loading.set(false);
     if (this._selectedRoleId() === roleId) {
      this._selectedRoleId.set(null);
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

 /**
  * Kullanıcıya rol atar
  * @param userId - Kullanıcı ID
  * @param roleIds - Atanacak rol ID'leri
  * @returns Başarı durumu promise
  */
 assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
  return firstValueFrom(
   this.http.post<void>(`${this.apiUrl}/assign`, { userId, roleIds }).pipe(
    tap(() => {}),
    catchError(error => {
     this.toast.create({
      position: 'bottom-center',
      content: 'Rol atanırken hata oluştu',
      type: 'error',
      time: 3,
     });
     return throwError(() => error);
    })
   )
  );
 }
}
