import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Unauthorized page
 * @description Yetkisiz erişim sayfası
 */
@Component({
 selector: 'app-unauthorized',
 templateUrl: './unauthorized.html',
 styleUrls: ['./unauthorized.scss'],
 standalone: true,
 imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class UnauthorizedPage {
 constructor() {}
}
