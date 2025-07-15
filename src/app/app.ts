import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgSidebarComponent, NgSidebarService, SidebarModel } from '@angulogic/ng-sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * App component, root component of the application
 * @description Sidebar is managing on this component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgSidebarComponent, MatCardModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected title = 'Edmin';
  sidebarWidth = 0;

  constructor() {
    this.sidebarService.sidebarWidth$.pipe(takeUntilDestroyed()).subscribe(width => {
      this.sidebarWidth = width;
    });
  }

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
        title: 'Tanımlamalar',
        data: [
          {
            name: 'Sınıf İşlemleri',
            route: '/class-operations',
          },
          {
            name: 'Sınav',
            route: '/exam',
          },
          {
            name: 'Ders',
            route: '/course-definition',
          },
          {
            name: 'Sınav Şablonu',
            route: '/exam-template',
          },
          {
            name: 'Öğretmenler',
            route: '/teacher',
          },
        ],
      },
    ],
    options: {
      expand: true,
      theme: 'light',
      autoPosition: true,
      viewMode: 'hover',
    },
  };
}
