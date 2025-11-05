/**
 * Environment configuration interface
 * @description Environment dosyalarının tip tanımı
 */
export interface Environment {
 /** Production modu aktif mi */
 production: boolean;
 /** API base URL */
 apiUrl: string;
 /** API versiyonu */
 apiVersion: string;
 /** Uygulama adı */
 appName: string;
 /** Uygulama versiyonu */
 appVersion: string;
 /** Debug modu aktif mi */
 enableDebug: boolean;
 /** Logging aktif mi */
 enableLogging: boolean;
 /** Log seviyesi */
 logLevel: 'debug' | 'info' | 'warn' | 'error';
 /** HTTP timeout süresi (ms) */
 timeout: number;
 /** Token storage key */
 tokenStorageKey: string;
 /** Refresh token storage key */
 refreshTokenStorageKey: string;
 /** User info storage key */
 userStorageKey: string;
}
