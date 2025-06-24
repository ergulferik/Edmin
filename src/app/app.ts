import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarModel } from '@angulogic/ng-sidebar';
import { NgSidebarModule } from '@angulogic/ng-sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgSidebarModule, MatCardModule, MatButtonModule,],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'Edmin';

  sidebar: SidebarModel = {
    bannerOptions: {
      title: 'Edmin',
    },
    userOptions: {
      name: 'John Doe',
      
    },
    sidebarData: [
      {
        title: 'Sınıf',
        data: [
          { name: 'Sınıf İşlemleri', route: '/class-operations' },
        ],
      },
    ],
    options: {
      expand: true,
      theme: 'light',
      autoPosition:true,
      viewMode: 'hover'
    },
  }
}
