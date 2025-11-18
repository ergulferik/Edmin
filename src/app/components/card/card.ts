import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card component for displaying content in a consistent card layout.
 * @description Tutarlı kart düzeni için yeniden kullanılabilir kart component'i
 */
@Component({
 selector: 'edmin-card',
 standalone: true,
 imports: [CommonModule],
 templateUrl: './card.html',
 styleUrls: ['./card.scss'],
})
export class CardComponent {
 /** Whether the card is clickable */
 @Input() clickable: boolean = false;
 /** Additional CSS classes */
 @Input() cardClass: string = '';

 @Output() onClick = new EventEmitter<Event>();
}
