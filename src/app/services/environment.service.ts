import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Environment service
 * @description Environment konfigürasyonuna erişim sağlar
 */
@Injectable({
 providedIn: 'root',
})
export class EnvironmentService {
 /**
  * Environment konfigürasyonunu döndürür
  * @returns Environment konfigürasyonu
  */
 getEnvironment() {
  return environment;
 }

 /**
  * Production modu kontrolü
  * @returns Production modu aktif mi
  */
 isProduction(): boolean {
  return environment.production;
 }

 /**
  * Debug modu kontrolü
  * @returns Debug modu aktif mi
  */
 isDebugEnabled(): boolean {
  return environment.enableDebug;
 }

 /**
  * Logging modu kontrolü
  * @returns Logging modu aktif mi
  */
 isLoggingEnabled(): boolean {
  return environment.enableLogging;
 }

 /**
  * API URL'ini döndürür
  * @returns API base URL
  */
 getApiUrl(): string {
  return environment.apiUrl;
 }

 /**
  * Tam API URL'ini döndürür (base + version)
  * @returns Tam API URL
  */
 getFullApiUrl(): string {
  return `${environment.apiUrl}/api/${environment.apiVersion}`;
 }

 /**
  * Uygulama adını döndürür
  * @returns Uygulama adı
  */
 getAppName(): string {
  return environment.appName;
 }

 /**
  * Uygulama versiyonunu döndürür
  * @returns Uygulama versiyonu
  */
 getAppVersion(): string {
  return environment.appVersion;
 }

 /**
  * Token storage key'ini döndürür
  * @returns Token storage key
  */
 getTokenStorageKey(): string {
  return environment.tokenStorageKey;
 }

 /**
  * Refresh token storage key'ini döndürür
  * @returns Refresh token storage key
  */
 getRefreshTokenStorageKey(): string {
  return environment.refreshTokenStorageKey;
 }

 /**
  * User info storage key'ini döndürür
  * @returns User info storage key
  */
 getUserStorageKey(): string {
  return environment.userStorageKey;
 }

 /**
  * HTTP timeout süresini döndürür
  * @returns Timeout süresi (ms)
  */
 getTimeout(): number {
  return environment.timeout;
 }

 /**
  * Log seviyesini döndürür
  * @returns Log seviyesi
  */
 getLogLevel(): string {
  return environment.logLevel;
 }
}
