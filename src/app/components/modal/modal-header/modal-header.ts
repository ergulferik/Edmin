import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIcon } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'edmin-modal-header',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    NgIcon
  ],
  viewProviders: [provideIcons({ heroXMark })],
  templateUrl: './modal-header.html',
  styleUrl: './modal-header.scss'
})
export class ModalHeader {
  title = input.required<string>();
  subtitle = input<string>();
  onClose = output<void>();

  dialogRef = inject(MatDialogRef);

  onCloseClick() {
    this.dialogRef.close();
    this.onClose.emit();
  }
}
