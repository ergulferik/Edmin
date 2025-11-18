import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { unAuthPages } from '../data/auth.data';

/**
 * Authentication guard
 * @description Kullanıcı oturum durumunu kontrol eder ve gerekli yönlendirmeleri yapar
 */
export const authGuard: CanActivateFn = async (route, state) => {
 const authService = inject(AuthService);
 const router = inject(Router);

 const isAuthenticated = await authService.isAuthenticated();
 const isAuthRoute = unAuthPages.some(page => state.url.startsWith(`/${page}`));

 // Kullanıcı giriş yapmamışsa ve auth sayfasında değilse login'e yönlendir
 if (!isAuthenticated && !isAuthRoute) {
  router.navigate(['/login']);
  return false;
 }

 // Kullanıcı giriş yapmışsa ve login/register sayfasındaysa ana sayfaya yönlendir
 if (isAuthenticated && isAuthRoute) {
  return false;
 }

 // Kullanıcı giriş yapmışsa ve korumalı sayfaya erişmeye çalışıyorsa izin ver
 if (isAuthenticated && !isAuthRoute) {
  return true;
 }

 // Kullanıcı giriş yapmamışsa ve auth sayfasındaysa izin ver
 if (!isAuthenticated && isAuthRoute) {
  return true;
 }

 return false;
};

/**
 * Authentication child guard
 * @description Child route'lar için authentication kontrolü yapar
 */
export const authGuardChild: CanActivateChildFn = async (route, state) => {
 const authService = inject(AuthService);
 const router = inject(Router);

 const isAuthenticated = await authService.isAuthenticated();
 const isAuthRoute = unAuthPages.some(page => state.url.startsWith(`/${page}`));

 // Kullanıcı giriş yapmamışsa ve auth sayfasında değilse login'e yönlendir
 if (!isAuthenticated && !isAuthRoute) {
  router.navigate(['/login']);
  return false;
 }

 // Kullanıcı giriş yapmışsa ve login/register sayfasındaysa ana sayfaya yönlendir
 if (isAuthenticated && isAuthRoute) {
  router.navigate(['/class-operations']);
  return false;
 }

 // Kullanıcı giriş yapmışsa ve korumalı sayfaya erişmeye çalışıyorsa izin ver
 if (isAuthenticated && !isAuthRoute) {
  return true;
 }

 // Kullanıcı giriş yapmamışsa ve auth sayfasındaysa izin ver
 if (!isAuthenticated && isAuthRoute) {
  return true;
 }

 return false;
};
