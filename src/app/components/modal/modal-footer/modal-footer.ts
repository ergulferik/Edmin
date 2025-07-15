import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

export interface ModalFooterButton {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  visible?: boolean;
  type?: 'submit' | 'cancel';
}

/**
 * ModalFooter component for displaying action buttons in a modal dialog.
 */
@Component({
  selector: 'edmin-modal-footer',
  imports: [MatButtonModule],
  templateUrl: './modal-footer.html',
  styleUrl: './modal-footer.scss',
})
/**
 * Displays footer buttons for modal dialogs.
 */
export class ModalFooter {
  /** List of footer buttons */
  buttons = input<ModalFooterButton[]>([]);
}
