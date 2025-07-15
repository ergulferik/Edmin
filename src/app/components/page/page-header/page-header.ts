import { Component, input } from '@angular/core';
import { AppButtonComponent } from '../../button/button';

@Component({
  selector: 'edmin-page-header',
  imports: [AppButtonComponent],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeaderComponent {
  title = input<string>();
  subtitle = input<string>();

  goBack() {
    window.history.back();
  }
}
