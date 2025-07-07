import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

export interface ModalFormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  validators?: any[];
  options?: { value: any; label: string }[];
  rows?: number;
  value?: string | number | boolean | Date;
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
    NgIcon
  ],
  templateUrl: './modal-form.html',
  styleUrls: ['./modal-form.scss'],
  viewProviders: [provideIcons({ heroXMark })]
})
export class ModalFormComponent implements OnInit {
  config!: ModalFormConfig;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
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

  onClose() {
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
} 