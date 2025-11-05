import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { unAuthPages } from '../data/auth.data';

/**
 * Authentication HTTP interceptor
 * @description Login ve register istekleri hariç tüm HTTP isteklerine JWT token ekler
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const authService = inject(AuthService);

 // Login ve register endpoint'lerini kontrol et
 const isUnAuthRequest = unAuthPages.some(
  page => req.url.includes(`/auth/${page}`) || req.url.endsWith(`/auth/${page}`)
 );

 // Login ve register istekleri için token ekleme
 if (isUnAuthRequest) {
  return next(req);
 }

 // Token'ı al
 const token = authService.getToken();

 // Token varsa Authorization header'ına ekle
 if (token) {
  const clonedRequest = req.clone({
   setHeaders: {
    Authorization: `Bearer ${token}`,
   },
  });
  return next(clonedRequest);
 }

 // Token yoksa isteği olduğu gibi gönder
 return next(req);
};
