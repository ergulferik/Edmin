import { inject } from '@angular/core';
import {
 CanActivateFn,
 CanActivateChildFn,
 Router,
 ActivatedRouteSnapshot,
 RouterStateSnapshot,
} from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';

/**
 * Permission guard
 * @description Route'lar için izin kontrolü yapar
 *
 * @example
 * // Route tanımında kullanım:
 * {
 *   path: 'student',
 *   component: StudentComponent,
 *   canActivate: [permissionGuard],
 *   data: { permission: 'student_view' }
 * }
 *
 * // Birden fazla izin (en az biri):
 * {
 *   path: 'student',
 *   component: StudentComponent,
 *   canActivate: [permissionGuard],
 *   data: { permissions: ['student_view', 'student_edit'], requireAll: false }
 * }
 *
 * // Tüm izinler gerekli:
 * {
 *   path: 'student',
 *   component: StudentComponent,
 *   canActivate: [permissionGuard],
 *   data: { permissions: ['student_view', 'student_edit'], requireAll: true }
 * }
 */
export const permissionGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
 const permissionService = inject(PermissionService);
 const authService = inject(AuthService);
 const router = inject(Router);
 const isAuthenticated = await authService.isAuthenticated();

 // Kullanıcı giriş yapmamışsa
 if (!isAuthenticated) {
  router.navigate(['/login']);
  return false;
 }

 const routeData = route.data;

 // Permission kontrolü yoksa izin ver
 if (!routeData['permission'] && !routeData['permissions']) {
  return true;
 }

 // Tek izin kontrolü
 if (routeData['permission']) {
  const hasPermission = permissionService.hasPermission(routeData['permission']);
  if (!hasPermission) {
   router.navigate(['/unauthorized']);
   return false;
  }
  return true;
 }

 // Çoklu izin kontrolü
 if (routeData['permissions'] && Array.isArray(routeData['permissions'])) {
  const permissions = routeData['permissions'];
  const requireAll = routeData['requireAll'] === true;

  let hasAccess = false;

  if (requireAll) {
   // Tüm izinler gerekli
   hasAccess = permissionService.hasAllPermissions(permissions);
  } else {
   // En az biri gerekli
   hasAccess = permissionService.hasAnyPermission(permissions);
  }

  if (!hasAccess) {
   router.navigate(['/unauthorized']);
   return false;
  }

  return true;
 }

 return true;
};

/**
 * Permission child guard
 * @description Child route'lar için izin kontrolü yapar
 */
export const permissionGuardChild: CanActivateChildFn = async (
 route: ActivatedRouteSnapshot,
 state: RouterStateSnapshot
) => {
 return (await permissionGuard(route, state)) as boolean;
};
