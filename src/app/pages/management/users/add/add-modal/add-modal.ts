import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalHeader } from '../../../../../components/modal/modal-header/modal-header';
import { CardComponent } from '../../../../../components/card/card';
import { CommonModule } from '@angular/common';

/**
 * Kullanıcı tipi enum
 * @description Yeni kullanıcı ekleme modal'ında seçilebilecek kullanıcı tipleri
 */
export enum UserType {
 STUDENT = 'student',
 TEACHER = 'teacher',
 EMPLOYEE = 'employee',
}

/**
 * Yeni kullanıcı ekleme modal component'i
 * @description Kullanıcı tipi seçimi için 3'lü seçim ekranı sunar
 */
@Component({
 selector: 'app-user-add-modal',
 imports: [CommonModule, ModalHeader, CardComponent],
 templateUrl: './add-modal.html',
 styleUrl: './add-modal.scss',
})
export class UserAddModal {
 private dialogRef = inject(MatDialogRef<UserAddModal>);

 // Template'de kullanmak için enum'u expose et
 readonly userType = UserType;

 /**
  * Kullanıcı tipi seçildiğinde çağrılır
  * @param userType Seçilen kullanıcı tipi
  */
 onSelectUserType(userType: UserType): void {
  this.dialogRef.close(userType);
 }

 /**
  * Modal'ı kapatır
  */
 onClose(): void {
  this.dialogRef.close();
 }
}
