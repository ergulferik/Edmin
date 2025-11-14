import { Injectable, inject, signal, computed } from '@angular/core';
import { IPermission, isChildPermission, perms } from '../data/perms';
import { IRole, UserInfo } from '../models/user.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

/**
 * Permission service
 * @description İzin doğrulama ve yönetimi için service sınıfı - Signal tabanlı state yönetimi
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
 // State signals
 private _userPermissions = signal<string[]>([]);
 private _userRoles = signal<string[]>([]);
 private _permissionTree = signal<IPermission[]>(perms);
 private http = inject(HttpClient);
 // Public readonly signals
 userPermissions = this._userPermissions.asReadonly();
 userRoles = this._userRoles.asReadonly();
 permissionTree = this._permissionTree.asReadonly();

 /**
  * Kullanıcı bilgilerini yükler ve izinleri hesaplar
  * @param userInfo - Kullanıcı bilgileri
  */
 async loadUserPermissions(userInfo: UserInfo | null): Promise<void> {
  if (!userInfo) {
   this._userPermissions.set([]);
   this._userRoles.set([]);
   return;
  }

  // Kullanıcının rol ID'lerini topla
  const roleIds = userInfo.roles?.map(role => role.id) || [];
  this._userRoles.set(roleIds);

  // Tüm izinleri topla (rollerden ve doğrudan atananlardan)
  const allPermissions = new Set<string>();

  // Rollerden gelen izinleri ekle
  if (userInfo.roles && userInfo.roles.length > 0) {
   for (const roleInfo of userInfo.roles) {
    try {
     const role = await this.http.get<IRole>(`${environment.apiUrl}/roles/${roleInfo}`).toPromise();

     if (role?.permissions) {
      for (const perm of role.permissions) {
       allPermissions.add(perm);
      }
     }
    } catch (error) {
     console.error(`Rol bilgisi alınamadı: ${roleInfo}`, error);
    }
   }
  }

  // Doğrudan atanan izinleri ekle
  if (userInfo.permissions) {
   userInfo.permissions.forEach(perm => allPermissions.add(perm));
  }

  this._userPermissions.set(Array.from(allPermissions));
 }
 /**
  * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder
  * @param permissionId - İzin ID
  * @param checkHierarchy - Hiyerarşik kontrol yapılsın mı? (default: true)
  * @returns İzine sahipse true
  */
 hasPermission(permissionId: string, checkHierarchy: boolean = true): boolean {
  const userPermissions = this._userPermissions();
  // Doğrudan kontrol
  if (userPermissions.includes(permissionId)) {
   return true;
  }

  // Hiyerarşik kontrol
  if (checkHierarchy) {
   const permissionTree = this._permissionTree();
   // Kullanıcının sahip olduğu herhangi bir izin, istenen iznin parent'ı mı?
   for (const userPerm of userPermissions) {
    if (isChildPermission(userPerm, permissionId, permissionTree)) {
     return true;
    }
   }
  }

  return false;
 }

 /**
  * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder (computed signal)
  * @param permissionId - İzin ID
  * @param checkHierarchy - Hiyerarşik kontrol yapılsın mı? (default: true)
  * @returns İzine sahipse true döndüren computed signal
  */
 hasPermissionSignal(permissionId: string, checkHierarchy: boolean = true) {
  return computed(() => {
   const userPermissions = this._userPermissions();

   // Doğrudan kontrol
   if (userPermissions.includes(permissionId)) {
    return true;
   }

   // Hiyerarşik kontrol
   if (checkHierarchy) {
    const permissionTree = this._permissionTree();
    for (const userPerm of userPermissions) {
     if (isChildPermission(userPerm, permissionId, permissionTree)) {
      return true;
     }
    }
   }

   return false;
  });
 }

 /**
  * Kullanıcının belirli izinlerden en az birine sahip olup olmadığını kontrol eder
  * @param permissionIds - İzin ID'leri dizisi
  * @param checkHierarchy - Hiyerarşik kontrol yapılsın mı? (default: true)
  * @returns En az bir izne sahipse true
  */
 hasAnyPermission(permissionIds: string[], checkHierarchy: boolean = true): boolean {
  return permissionIds.some(id => this.hasPermission(id, checkHierarchy));
 }

 /**
  * Kullanıcının belirli izinlerin tümüne sahip olup olmadığını kontrol eder
  * @param permissionIds - İzin ID'leri dizisi
  * @param checkHierarchy - Hiyerarşik kontrol yapılsın mı? (default: true)
  * @returns Tüm izinlere sahipse true
  */
 hasAllPermissions(permissionIds: string[], checkHierarchy: boolean = true): boolean {
  return permissionIds.every(id => this.hasPermission(id, checkHierarchy));
 }

 /**
  * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
  * @param roleId - Rol ID
  * @returns Role sahipse true
  */
 hasRole(roleId: string): boolean {
  return this._userRoles().includes(roleId);
 }

 /**
  * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder (computed signal)
  * @param roleId - Rol ID
  * @returns Role sahipse true döndüren computed signal
  */
 hasRoleSignal(roleId: string) {
  return computed(() => this._userRoles().includes(roleId));
 }

 /**
  * Kullanıcının belirli rollerden en az birine sahip olup olmadığını kontrol eder
  * @param roleIds - Rol ID'leri dizisi
  * @returns En az bir role sahipse true
  */
 hasAnyRole(roleIds: string[]): boolean {
  const userRoles = this._userRoles();
  return roleIds.some(id => userRoles.includes(id));
 }

 /**
  * Kullanıcının belirli rollerin tümüne sahip olup olmadığını kontrol eder
  * @param roleIds - Rol ID'leri dizisi
  * @returns Tüm rollere sahipse true
  */
 hasAllRoles(roleIds: string[]): boolean {
  const userRoles = this._userRoles();
  return roleIds.every(id => userRoles.includes(id));
 }

 /**
  * Kullanıcının tüm izinlerini döndürür
  * @returns İzin ID'leri dizisi
  */
 getUserPermissions(): string[] {
  return this._userPermissions();
 }

 /**
  * Kullanıcının tüm rollerini döndürür
  * @returns Rol ID'leri dizisi
  */
 getUserRoles(): string[] {
  return this._userRoles();
 }

 /**
  * İzin ağacını yükler
  * @param permissionTree - İzin ağacı
  */
 setPermissionTree(permissionTree: IPermission[]): void {
  this._permissionTree.set(permissionTree);
 }
}
