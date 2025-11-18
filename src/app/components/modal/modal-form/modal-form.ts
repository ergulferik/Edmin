import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppButtonComponent } from '../../button/button';
import { FilePickerComponent } from '../../file-picker/file-picker';
import { ModalHeader } from '../modal-header/modal-header';
import { ModalFooter, ModalFooterButton } from '../modal-footer/modal-footer';

export interface ModalFormField {
 key: string;
 label?: string;
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
  MatIconModule,
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
    return 'Bu alan zorunludur';
   }
   if (control.errors['email']) {
    return 'Lütfen geçerli bir email adresi giriniz';
   }
   if (control.errors['minlength']) {
    return `En az ${control.errors['minlength'].requiredLength} karakter olmalıdır`;
   }
   if (control.errors['maxlength']) {
    return `En fazla ${control.errors['maxlength'].requiredLength} karakter olmalıdır`;
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

 /**
  * Converts time interval string to seconds for HTML time input step attribute.
  * @param interval - Interval in minutes as string (e.g., "10" for 10 minutes)
  * @returns Step value in seconds (default: 600 for 10 minutes)
  */
 getTimeStep(interval?: string): number {
  if (!interval) {
   return 600; // Default: 10 minutes in seconds
  }
  const minutes = parseInt(interval, 10);
  if (isNaN(minutes) || minutes <= 0) {
   return 600; // Default: 10 minutes in seconds
  }
  return minutes * 60; // Convert minutes to seconds
 }

 /**
  * Gets the label for the selected option in a select field.
  * @param field - The form field configuration
  * @returns The label of the selected option or null
  */
 getSelectedLabel(field: ModalFormField): string | null {
  if (!field.options) {
   return null;
  }
  const selectedValue = this.form.get(field.key)?.value;
  if (selectedValue === null || selectedValue === undefined || selectedValue === '') {
   return null;
  }
  const selectedOption = field.options.find(opt => opt.value === selectedValue);
  return selectedOption ? selectedOption.label : null;
 }

 /**
  * Handles option selection in Bootstrap dropdown.
  * @param fieldKey - The form control key
  * @param value - The selected option value
  */
 selectOption(fieldKey: string, value: any): void {
  this.form.get(fieldKey)?.setValue(value);
  this.form.get(fieldKey)?.markAsTouched();
  // Close dropdown by removing show class
  const dropdownId = `dropdown-${fieldKey}`;
  const dropdownButton = document.getElementById(dropdownId);
  if (dropdownButton) {
   const dropdownElement = dropdownButton.closest('.dropdown');
   if (dropdownElement) {
    const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
    if (dropdownMenu) {
     dropdownMenu.classList.remove('show');
    }
    dropdownElement.classList.remove('show');
    dropdownButton.setAttribute('aria-expanded', 'false');
   }
  }
 }
}
