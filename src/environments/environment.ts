import { Environment } from './environment.interface';

/**
 * Production environment configuration
 * @description Production ortamı için varsayılan environment dosyası
 */
export const environment: Environment = {
 production: true,
 apiUrl: 'https://api.edmin.com',
 apiVersion: 'v1',
 appName: 'Edmin',
 appVersion: '1.0.0',
 enableDebug: false,
 enableLogging: false,
 logLevel: 'error',
 timeout: 30000,
 tokenStorageKey: 'edmin_auth_token',
 refreshTokenStorageKey: 'edmin_refresh_token',
 userStorageKey: 'edmin_user_info',
};
