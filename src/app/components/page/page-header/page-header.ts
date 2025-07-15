import { Component, input } from '@angular/core';
import { AppButtonComponent } from '../../button/button';

/**
 * PageHeaderComponent displays the page title, subtitle, and a back button.
 */
@Component({
 selector: 'edmin-page-header',
 imports: [AppButtonComponent],
 templateUrl: './page-header.html',
 styleUrl: './page-header.scss',
})
/**
 * Displays the page header with title, subtitle, and back navigation.
 */
export class PageHeaderComponent {
 /** Page title */
 title = input<string>();
 /** Page subtitle */
 subtitle = input<string>();

 /**
  * Navigates back in browser history.
  */
 goBack() {
  window.history.back();
 }
}
