import { Component, inject, Type, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgComponentOutlet } from '@angular/common';
import { ModalFooterButton } from '../modal-footer/modal-footer';
import { ModalFooter } from '../modal-footer/modal-footer';
import { ModalHeader } from '../modal-header/modal-header';
import { DynamicModalService } from '../../../services/dynamic-modal.service';

/**
 * Dialog data interface
 * @description Dialog data interface for modal content
 */
interface DialogData {
 content: Type<any>;
 title: string;
 subtitle?: string;
 footer?: ModalFooterButton[];
 contentData?: any;
}

/**
 * Empty modal component
 * @description Empty modal component for displaying modal content
 */
@Component({
 selector: 'app-empty-modal',
 imports: [ModalFooter, ModalHeader, NgComponentOutlet],
 templateUrl: './empty-modal.html',
 styleUrl: './empty-modal.scss',
})
/**
 * Empty modal component
 * @description Empty modal component for displaying modal content
 */
export class EmptyModal {
 protected dialogRef = inject(MatDialogRef<EmptyModal>);
 content!: Type<any>;
 title!: string;
 subtitle?: string;
 footer: ModalFooterButton[];
 private dynamicModalService = inject(DynamicModalService);
 constructor(@Inject(MAT_DIALOG_DATA) data: DialogData) {
  this.content = data.content;
  this.title = data.title;
  this.subtitle = data.subtitle;
  this.footer = data.footer ?? [
   {
    title: 'Kaydet',
    disabled: false,
    onClick: () => this.dialogRef.close('save'),
    type: 'submit',
   },
   {
    title: 'İptal',
    disabled: false,
    onClick: () => this.dialogRef.close('cancel'),
    type: 'cancel',
   },
  ];
  this.dynamicModalService.modalData = data.contentData;
 }
}
