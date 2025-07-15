import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppButtonComponent } from "../../button/button";
import { FilePickerComponent } from '../../file-picker/file-picker';
import { ModalHeader } from '../modal-header/modal-header';
import { ModalFooter } from '../modal-footer/modal-footer';

export interface ModalFormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'template' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  validators?: any[];
  options?: { value: any; label: string }[];
  rows?: number;
  value?: string | number | boolean | Date | File;
  template?: {
    component: any;
    data?: any;
    displayExpr: string;
    keyExpr: string;
    displayValue?: any;
  }
  accept?: string;
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
    AppButtonComponent,
    FilePickerComponent,
    ModalHeader,
    ModalFooter
],
  templateUrl: './modal-form.html',
  styleUrls: ['./modal-form.scss'],
})
export class ModalFormComponent implements OnInit {
  config!: ModalFormConfig;
  form!: FormGroup;
  footer = {
    submitButton: {
      title: 'Kaydet',
      disabled: false,
      onClick: () => this.onSubmit()
    },
    cancelButton: {
      title: 'İptal',
      disabled: false,
      onClick: () => this.onCancel()
    }
  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { config: ModalFormConfig }
  ) {
    this.config = data.config;
  }

  ngOnInit() {
    this.createForm();
  }

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

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldKey: string): string {
    const control = this.form.get(fieldKey);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Bu alan zorunludur';
      }
      if (control.errors['email']) {
        return 'Geçerli bir email adresi giriniz';
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

  isFieldInvalid(fieldKey: string): boolean {
    const control = this.form.get(fieldKey);
    return !!(control?.invalid && control?.touched);
  }

  async openTemplateDialog(field: ModalFormField) {
    if (!field.template?.component) {
      console.error('Template component is not defined for field:', field);
      return;
    }

    const dialogRef =  this.dialog.open(field.template.component, {
      width: '80%',
      height: '80%',
      data: field.template.data
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      // Template componentten seçilen değeri form kontrolüne atıyoruz
      this.form.get(field.key)?.setValue(result[field.template?.keyExpr || 'id']);
      field.template.displayValue = result[field.template?.displayExpr || 'name'];
    }
  }
  
  onFileChange(event: Event, fieldKey: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.get(fieldKey)?.setValue(file || null);
    this.form.get(fieldKey)?.markAsTouched();
  }

  removeFile(fieldKey: string): void {
    this.form.get(fieldKey)?.setValue(null);
    this.form.get(fieldKey)?.markAsTouched();
  }
} 