import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClassItem, Field } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { HelperService } from '../../services/helper.service';
import { DcToastService } from 'dc-toast-ng';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-definition',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatRippleModule,
    NgIcon
  ],
  templateUrl: './class-definition.html',
  styleUrls: ['./class-definition.scss'],
  viewProviders: [provideIcons({ heroPlus, heroPencil, heroTrash })]
})
export class ClassDefinitionPage {
  private router = inject(Router);
  private classService = inject(ClassService);
  private helperService = inject(HelperService);
  private toast = inject(DcToastService);

  // Data observables
  classes?: ClassItem[];
  fields?: Field[];

  // Form data
  newClass: Partial<ClassItem> = {
    name: '',
    fieldId: '',
    studentCount: 0,
    averageGrade: 0
  };

  newField: Partial<Field> = {
    name: '',
    order: 0
  };

  // UI state
  isAddingClass = false;
  isAddingField = false;
  editingClass: ClassItem | null = null;
  editingField: Field | null = null;

  // Table columns
  displayedColumns: string[] = ['name', 'field', 'studentCount', 'averageGrade', 'actions'];
  fieldColumns: string[] = ['name', 'order', 'actions'];

  constructor() {
    effect(async () => {
      this.classes = await this.classService.getClasses();
      this.fields = await this.classService.getFields();
    });
  }

  // Class operations
  async addClass() {
    if (!this.newClass.name || !this.newClass.fieldId) {
      this.toast.create({
        position: 'bottom-center',
        content: 'Please fill all required fields',
        type: 'error',
        time: 3
      });
      return;
    }

    const classData: Omit<ClassItem, 'id'> = {
      name: this.newClass.name!,
      fieldId: this.newClass.fieldId!,
      studentCount: this.newClass.studentCount || 0,
      averageGrade: this.newClass.averageGrade || 0
    };

    await this.classService.createClass(classData);
    this.resetClassForm();
  }

  editClass(classItem: ClassItem) {
    this.editingClass = { ...classItem };
    this.newClass = { ...classItem };
    this.isAddingClass = true;
  }

  async updateClass() {
    if (!this.editingClass) return;

    await this.classService.updateClass(this.editingClass.id, this.newClass);

    this.cancelEdit();
  }

  async deleteClass(classItem: ClassItem) {
    const result = await Swal.fire({
      html: `<strong>${classItem.name}</strong> sınıfını silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      confirmButtonText: 'Evet',
      confirmButtonColor: 'var(--error-600)',
      showCancelButton: true,
      cancelButtonText: 'Hayır',
      cancelButtonColor: 'var(--primary-600)',
      focusCancel: true
    })
    if (result.isConfirmed) {
      await this.classService.deleteClass(classItem.id);
    }
  }

  // Field operations
  async addField() {
    if (!this.newField.name) {
      this.toast.create({
        position: 'bottom-center',
        content: 'Please enter field name',
        type: 'error',
        time: 3
      });
      return;
    }

    const fieldData: Omit<Field, 'id'> = {
      name: this.newField.name!,
      order: this.newField.order || 0
    };

    await this.classService.createField(fieldData);

    this.resetFieldForm();

  }

  editField(field: Field) {
    this.editingField = { ...field };
    this.newField = { ...field };
    this.isAddingField = true;
  }

  async updateField() {
    if (!this.editingField) return;

    await this.classService.updateField(this.editingField.id, this.newField);

    this.cancelFieldEdit();
  }

  async deleteField(field: Field) {
    const result = await Swal.fire({
      html: `<strong>${field.name}</strong> alanını silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      confirmButtonText: 'Evet',
      confirmButtonColor: 'var(--error-600)',
      showCancelButton: true,
      cancelButtonText: 'Hayır',
      cancelButtonColor: 'var(--primary-600)',
      focusCancel: true
    })
    if (result.isConfirmed) {
      await this.classService.deleteField(field.id);
    }
  }

  // Utility methods
  getFieldName(fieldId: string, fields: Field[]): string {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'Unknown';
  }

  resetClassForm() {
    this.newClass = {
      name: '',
      fieldId: '',
      studentCount: 0,
      averageGrade: 0
    };
    this.isAddingClass = false;
    this.editingClass = null;
  }

  resetFieldForm() {
    this.newField = {
      name: '',
      order: 0
    };
    this.isAddingField = false;
    this.editingField = null;
  }

  cancelEdit() {
    this.resetClassForm();
  }

  cancelFieldEdit() {
    this.resetFieldForm();
  }

  goBack() {
    this.router.navigate(['/class-operations']);
  }
} 