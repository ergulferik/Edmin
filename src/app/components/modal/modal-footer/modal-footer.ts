import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'edmin-modal-footer',
  imports: [MatButtonModule],
  templateUrl: './modal-footer.html',
  styleUrl: './modal-footer.scss'
})
export class ModalFooter {
  submitButton = input<{ title: string, disabled: boolean, onClick: () => void }>();
  cancelButton = input<{ title: string, disabled: boolean, onClick: () => void }>();

}
