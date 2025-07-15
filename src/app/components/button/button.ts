import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Reusable and dynamic button component. Supports different types, icons, and text.
 */
@Component({
 selector: 'edmin-button',
 standalone: true,
 imports: [CommonModule, MatButtonModule, MatIconModule],
 templateUrl: './button.html',
 styleUrls: ['./button.scss'],
})
/**
 * AppButtonComponent provides a customizable button with icon and type support.
 */
export class AppButtonComponent {
 /** Button text */
 @Input()
 text: string = '';
 /** Icon name (for mat-icon) */
 @Input()
 icon?: string;
 /** Button type: 'primary', 'accent', 'warn', 'secondary', 'outlined', 'back' */
 @Input()
 type: 'primary' | 'accent' | 'warn' | 'secondary' | 'outlined' | 'back' = 'primary';
 /** Is the button disabled? */
 @Input()
 disabled: boolean = false;
 /** Click event */
 @Output()
 onClick = new EventEmitter<Event>();

 /**
  * Returns the color for Angular Material button based on type.
  */
 get color() {
  if (this.type === 'primary' || this.type === 'accent' || this.type === 'warn') {
   return this.type;
  }
  return undefined;
 }

 /**
  * Returns the CSS class for the button based on type.
  */
 get buttonClass() {
  return {
   'mat-outlined-button': this.type === 'outlined',
   'mat-stroked-button': this.type === 'secondary',
  };
 }
}
