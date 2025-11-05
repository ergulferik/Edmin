import {
 ApplicationConfig,
 importProvidersFrom,
 provideBrowserGlobalErrorListeners,
 provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
 providers: [
  provideBrowserGlobalErrorListeners(),
  provideZoneChangeDetection({
   eventCoalescing: true,
  }),
  provideRouter(routes),
  provideAnimations(),
  importProvidersFrom(MatNativeDateModule),
  {
   provide: MAT_DATE_LOCALE,
   useValue: 'tr-TR',
  },
  {
   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
   useValue: {
    subscriptSizing: 'dynamic',
   },
  },
  provideHttpClient(withInterceptors([authInterceptor])),
  importProvidersFrom(
   CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory,
   })
  ),
 ],
};
