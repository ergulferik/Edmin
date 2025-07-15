import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIcon } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';

/**
 * ModalHeader component for displaying the header of a modal dialog.
 */
@Component({
  selector: 'edmin-modal-header',
  imports: [CommonModule, MatIconModule, MatButtonModule, NgIcon],
  viewProviders: [
    provideIcons({
      heroXMark,
    }),
  ],
  templateUrl: './modal-header.html',
  styleUrl: './modal-header.scss',
})
/**
 * Displays the title, subtitle, and close button for modal dialogs.
 */
export class ModalHeader {
  /** Modal title */
  title = input.required<string>();
  /** Modal subtitle */
  subtitle = input<string>();
  /** Close event output */
  onClose = output<void>();
}
