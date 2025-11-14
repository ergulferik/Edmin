import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgSidebarComponent, NgSidebarService, SidebarModel } from '@angulogic/ng-sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { AuthService } from './services/auth.service';
import { heroArrowRightOnRectangle } from '@ng-icons/heroicons/outline';
import { DcToastService } from 'dc-toast-ng';
import { sidebarRoutes } from './app.routes';

registerLocaleData(localeTr, 'tr-TR');

/**
 * App component, root component of the application
 * @description Sidebar is managing on this component
 */
@Component({
 selector: 'app-root',
 standalone: true,
 imports: [RouterOutlet, NgSidebarComponent, MatCardModule, MatButtonModule, ReactiveFormsModule, CommonModule, NgIcon],
 templateUrl: './app.html',
 styleUrls: ['./app.scss'],
 providers: [
  provideIcons({
   heroArrowRightOnRectangle,
  }),
 ],
})
export class App {
 protected title = 'Edmin';
 sidebarWidth = 0;
 protected theme: 'light' | 'dark' = 'light';
 isSidebarVisible = signal<boolean>(false);
 authService = inject(AuthService);
 toast = inject(DcToastService);
 router = inject(Router);

 sidebarService = inject(NgSidebarService);
 sidebar: SidebarModel = {
  bannerOptions: {
   title: 'Edmin',
  },
  userOptions: {
   name: 'John Doe',
  },
  sidebarData: [
   {
    title: 'Sınıf İşlemleri',
    data: [
     {
      name: 'Sınıflar',
      icon: 'assets/icons/school.svg',
      route: '/class-operations',
     },

     {
      name: 'Ders Programı',
      icon: 'assets/icons/calendar-week.svg',
      route: '/class/course-schedule',
     },
    ],
   },
   {
    title: 'Tanımlamalar',
    data: [
     {
      name: 'Sınav',
      route: '/exam',
      icon: 'assets/icons/exam.svg',
     },
     {
      name: 'Ders',
      route: '/course-definition',
      icon: 'assets/icons/lesson.svg',
     },
     {
      name: 'Sınav Şablonu',
      route: '/exam-template',
      icon: 'assets/icons/template.svg',
     },
     {
      name: 'Öğretmenler',
      route: '/teacher',
      icon: 'assets/icons/teacher.svg',
     },
    ],
   },
   {
    title: 'Yönetim',
    data: [
     {
      name: 'Roller',
      route: '/role-management',
     },
    ],
   },
  ],
  options: {
   favoritesTitle: 'Favoriler',
   expand: true,
   theme: this.theme,
   autoPosition: true,
   viewMode: 'toggle',
   onCollapse: () => {
    this.onSidebarWidthChange();
   },
   onExpand: () => {
    this.onSidebarWidthChange();
   },
   onThemeChange: (theme: 'light' | 'dark') => this.onThemeChange(theme),
  },
 };

 constructor() {
  this.sidebarService.sidebarWidth$.pipe(takeUntilDestroyed()).subscribe(width => {
   this.sidebarWidth = width;
  });

  this.router.events.pipe(takeUntilDestroyed()).subscribe((event: any) => {
   if (event instanceof NavigationEnd) {
    this.isSidebarVisible.set(sidebarRoutes.some(route => event.url.startsWith(`/${route.path}`)));
   }
  });
 }

 onSidebarWidthChange() {
  const interval = setInterval(() => {
   this.sidebarWidth = this.sidebarService.sidebarWidth$.getValue();
  }, 5);
  setTimeout(() => {
   this.sidebarWidth = this.sidebarService.sidebarWidth$.getValue();
   clearInterval(interval);
  }, 300);
 }

 onThemeChange(theme: 'light' | 'dark') {
  this.theme = theme;
  const body = document.body;
  if (theme === 'dark') {
   body.classList.add('dark-theme');
  } else {
   body.classList.remove('dark-theme');
  }
 }

 logout() {
  this.authService
   .logout()
   .then(() => {
    this.sidebarWidth = 0;
    this.router.navigate(['/login']);
   })
   .catch(error => {
    this.toast.create({
     position: 'bottom-center',
     content: error.error.message,
     type: 'error',
     time: 3,
    });
   });
 }
}
