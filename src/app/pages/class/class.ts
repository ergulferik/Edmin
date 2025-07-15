import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ClassItem, Field } from '../../models/class.model';
import { Student } from '../../models/student.model';
import { FieldComponent } from './field/field';
import { ClassList } from './class-list/class-list';
import { StudentList } from './student-list/student-list';
import { ClassService } from '../../services/class.service';
import { DcToastService } from 'dc-toast-ng';
import Swal from 'sweetalert2';

/**
 * Class page for managing classes and students. Supports filtering, drag-and-drop, and class assignment.
 */
@Component({
  selector: 'app-class',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FieldComponent,
    ClassList,
    StudentList,
  ],
  templateUrl: './class.html',
  styleUrl: './class.scss',
})
export class Class {
  /** List of classes */
  classes: ClassItem[] = [];
  /** List of students */
  students: Student[] = [];
  /** Currently selected class */
  selectedClass: ClassItem | null = null;
  /** Currently selected field */
  selectedField = 'all';
  /** Filtered classes */
  filteredClasses: ClassItem[] = [];
  /** Class id for drag-over effect */
  dragOverClass: string | null = null;
  /** Class service instance */
  classService = inject(ClassService);

  toast = inject(DcToastService);
  /**
   * Initializes the class page and sets up reactive data.
   */
  constructor() {
    effect(() => {
      this.classes = this.classService.classes();
      this.students = this.classService.students();
      this.filteredClasses =
        this.selectedField === 'all'
          ? this.classes
          : this.classes.filter(c => c.fieldId === this.selectedField);
    });
  }

  /**
   * Selects a class.
   */
  selectClass(classItem: ClassItem) {
    this.selectedClass = classItem;
  }

  /**
   * Handles field selection event.
   */
  onFieldSelected(field: Field) {
    this.selectedField = field.id;
    this.filteredClasses =
      field.id === 'all'
        ? this.classes
        : this.classes.filter(c => c.fieldId === this.selectedField);
  }

  /**
   * Handles drag over event for a class.
   */
  onDragOver(event: DragEvent, classItem: ClassItem) {
    if (this.classService.draggedStudent()?.classId !== classItem.id) {
      event.preventDefault();
    }
  }

  /**
   * Handles drag start for a student.
   */
  onDragStart(student: Student) {
    this.classService.draggedStudent.set(student);
  }

  /**
   * Handles drag end event.
   */
  onDragEnd() {
    this.classService.draggedStudent.set(null);
    this.dragOverClass = null;
  }

  /**
   * Handles drop event for assigning a student to a class.
   */
  async onDrop(event: DragEvent, classItem: ClassItem) {
    if (!event) return;
    event.preventDefault();
    const student = this.classService.draggedStudent();
    const result = await Swal.fire({
      html: `<strong>${student?.name} ${student?.surname}</strong> will be moved to <strong>${classItem.name}</strong> class. Are you sure?`,
      icon: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: 'var(--primary-600)',
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: 'var(--error-600)',
    });
    if (result.isConfirmed) {
      if (student && classItem) {
        this.classService.updateStudent(student.id, {
          classId: classItem.id,
        });
        this.onDragEnd();
        // Show success message
        this.toast.create({
          position: 'bottom-center',
          content: `${student.name} ${student.surname} moved to ${classItem.name} class`,
          type: 'success',
          time: 3,
          allowTimeBar: true,
        });
      }
    }
  }

  /**
   * Opens the form to add a new class.
   */
  addNewClass() {
    this.selectedClass = null;
  }
}
