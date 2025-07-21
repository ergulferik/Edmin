import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppButtonComponent } from '../../button/button';
import { FilePickerComponent } from '../../file-picker/file-picker';
import { ModalHeader } from '../modal-header/modal-header';
import { ModalFooter, ModalFooterButton } from '../modal-footer/modal-footer';
import { MatTimepickerModule } from '@angular/material/timepicker';

export interface ModalFormField {
 key: string;
 label: string;
 type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'template' | 'date' | 'file' | 'time';
 placeholder?: string;
 required?: boolean;
 validators?: any[];
 options?: {
  value: any;
  label: string;
 }[];
 rows?: number;
 value?: string | number | boolean | Date | File;
 template?: {
  component: any;
  data?: any;
  displayExpr: string;
  keyExpr: string;
  displayValue?: any;
 };
 accept?: string;
 timeOptions?: {
  min: string;
  max: string;
  interval: string;
 };
}

export interface ModalFormConfig {
 title: string;
 subtitle?: string;
 fields: ModalFormField[];
 submitText?: string;
 cancelText?: string;
 width?: string;
 height?: string;
}

/**
 * ModalFormComponent provides a dynamic form inside a modal dialog.
 * Supports various field types, validation, and file uploads.
 */
@Component({
 selector: 'app-modal-form',
 standalone: true,
 imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatDialogModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTimepickerModule,
  AppButtonComponent,
  FilePickerComponent,
  ModalHeader,
  ModalFooter,
 ],
 templateUrl: './modal-form.html',
 styleUrls: ['./modal-form.scss'],
})
export class ModalFormComponent implements OnInit {
 /** Modal form configuration */
 config!: ModalFormConfig;
 /** Reactive form group */
 form!: FormGroup;
 /** Footer button configuration */
 footer = signal<ModalFooterButton[]>([
  {
   title: 'Save',
   disabled: false,
   onClick: () => this.onSubmit(),
   type: 'submit',
  },
  {
   title: 'Cancel',
   disabled: false,
   onClick: () => this.onCancel(),
   type: 'cancel',
  },
 ]);

 fb = inject(FormBuilder);
 dialog = inject(MatDialog);
 dialogRef = inject(MatDialogRef<ModalFormComponent>);
 data = inject(MAT_DIALOG_DATA);
 constructor() {
  this.config = this.data.config;
 }

 /**
  * Initializes the form on component init.
  */
 ngOnInit() {
  this.createForm();
 }

 /**
  * Creates the reactive form group based on config fields.
  */
 private createForm() {
  const group: any = {};
  this.config.fields.forEach(field => {
   const validators = [];
   if (field.required) {
    validators.push(Validators.required);
   }
   if (field.validators) {
    validators.push(...field.validators);
   }
   group[field.key] = [field.value || null, validators];
  });
  this.form = this.fb.group(group);
 }

 /**
  * Handles form submission.
  */
 onSubmit() {
  if (this.form.valid) {
   this.dialogRef.close(this.form.value);
  } else {
   this.markFormGroupTouched();
  }
 }

 /**
  * Handles cancel action.
  */
 onCancel() {
  this.dialogRef.close(null);
 }

 /**
  * Marks all form controls as touched.
  */
 private markFormGroupTouched() {
  Object.keys(this.form.controls).forEach(key => {
   const control = this.form.get(key);
   control?.markAsTouched();
  });
 }

 /**
  * Returns error message for a field.
  */
 getFieldError(fieldKey: string): string {
  const control = this.form.get(fieldKey);
  if (control?.errors && control.touched) {
   if (control.errors['required']) {
    return 'This field is required';
   }
   if (control.errors['email']) {
    return 'Please enter a valid email address';
   }
   if (control.errors['minlength']) {
    return `Minimum length is ${control.errors['minlength'].requiredLength}`;
   }
   if (control.errors['maxlength']) {
    return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
   }
  }
  return '';
 }

 /**
  * Checks if a field is invalid and touched.
  */
 isFieldInvalid(fieldKey: string): boolean {
  const control = this.form.get(fieldKey);
  return !!(control?.invalid && control?.touched);
 }

 /**
  * Opens a dialog for template field selection.
  */
 async openTemplateDialog(field: ModalFormField) {
  if (!field.template?.component) {
   console.error('Template component is not defined for field:', field);
   return;
  }

  const dialogRef = this.dialog.open(field.template.component, {
   width: '80%',
   height: '80%',
   data: field.template.data,
  });

  const result = await dialogRef.afterClosed().toPromise();
  if (result) {
   // Assign the selected value from the template component to the form control
   this.form.get(field.key)?.setValue(result[field.template?.keyExpr || 'id']);
   field.template.displayValue = result[field.template?.displayExpr || 'name'];
  }
 }

 /**
  * Handles file input change for a field.
  */
 onFileChange(event: Event, fieldKey: string): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  this.form.get(fieldKey)?.setValue(file || null);
  this.form.get(fieldKey)?.markAsTouched();
 }

 /**
  * Removes the file from a field.
  */
 removeFile(fieldKey: string): void {
  this.form.get(fieldKey)?.setValue(null);
  this.form.get(fieldKey)?.markAsTouched();
 }
}
