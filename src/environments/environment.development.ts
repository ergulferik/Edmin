import { Environment } from './environment.interface';

/**
 * Development environment configuration
 * @description Development ortamı için environment dosyası
 */
export const environment: Environment = {
 production: false,
 apiUrl: 'http://localhost:3000',
 apiVersion: 'v1',
 appName: 'Edmin',
 appVersion: '1.0.0',
 enableDebug: true,
 enableLogging: true,
 logLevel: 'debug',
 timeout: 30000,
 tokenStorageKey: 'edmin_auth_token',
 refreshTokenStorageKey: 'edmin_refresh_token',
 userStorageKey: 'edmin_user_info',
};
