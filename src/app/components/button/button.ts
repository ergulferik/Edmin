import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * @component AppButtonComponent
 * Yeniden kullanılabilir, dinamik buton component'i. Farklı tipler, ikon ve metin desteği ile birlikte gelir.
 */
@Component({
  selector: 'edmin-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss']
})
export class AppButtonComponent {
  /** Buton metni */
  @Input() text: string = '';
  /** İkon ismi (mat-icon için) */
  @Input() icon?: string;
  /** Buton tipi: 'primary', 'accent', 'warn', 'secondary', 'outlined' */
  @Input() type: 'primary' | 'accent' | 'warn' | 'secondary' | 'outlined' | 'back' = 'primary';
  /** Buton devre dışı mı? */
  @Input() disabled: boolean = false;
  /** Tıklama eventi */
  @Output() onClick = new EventEmitter<Event>();

  get color() {
    if (this.type === 'primary' || this.type === 'accent' || this.type === 'warn') {
      return this.type;
    }
    return undefined;
  }

  get buttonClass() {
    return {
      'mat-outlined-button': this.type === 'outlined',
      'mat-stroked-button': this.type === 'secondary',
    };
  }
} 