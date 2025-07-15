import { Component, Input, Output, EventEmitter, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ClassItem, Field } from '../../../models/class.model';
import { ClassService } from '../../../services/class.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash, heroPlus } from '@ng-icons/heroicons/outline';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent, ModalFormConfig } from '../../../components/modal/modal-form/modal-form';
import Swal from 'sweetalert2';

/**
 * ClassList component displays a list of classes with selection, drag-and-drop, and CRUD operations.
 */
@Component({
 selector: 'app-class-list',
 imports: [CommonModule, MatIconModule, MatButtonModule, MatRippleModule, NgIcon],
 templateUrl: './class-list.html',
 styleUrl: './class-list.scss',
 viewProviders: [
  provideIcons({
   heroPencilSquare,
   heroTrash,
   heroPlus,
  }),
 ],
})
/**
 * Provides class list display, selection, and management.
 */
export class ClassList implements OnInit {
 /** List of all classes */
 @Input()
 classes: ClassItem[] = [];
 /** Currently selected class */
 @Input()
 selectedClass: ClassItem | null = null;
 /** Currently selected field id */
 @Input()
 selectedField: string = 'all';
 /** Filtered classes */
 @Input()
 filteredClasses: ClassItem[] = [];

 /** Emits when a class is selected */
 @Output()
 classSelected = new EventEmitter<ClassItem>();
 /** Emits on drag over event */
 @Output()
 dragOver = new EventEmitter<{
  event: DragEvent;
  classItem: ClassItem;
 }>();
 /** Emits on drop event */
 @Output()
 drop = new EventEmitter<{
  event: DragEvent;
  classItem: ClassItem;
 }>();
 /** Emits when add new class is triggered */
 @Output()
 addNewClass = new EventEmitter<void>();

 classService = inject(ClassService);
 dialog = inject(MatDialog);
 fields = signal<Field[]>([]);

 /** Modal form configuration for class add/edit */
 modalConfig: ModalFormConfig = {
  title: 'Add Class',
  subtitle: 'Enter new class information',
  fields: [
   {
    key: 'name',
    label: 'Class Name',
    type: 'text',
    placeholder: 'Class name...',
    required: true,
   },
   {
    key: 'fieldId',
    label: 'Class Field',
    type: 'select',
   },
  ],
  submitText: 'Save',
  cancelText: 'Cancel',
  width: '500px',
 };

 constructor() {
  effect(() => {
   this.fields.set(this.classService.fields());
   this.updateModalFields();
  });
 }

 /**
  * Initializes filteredClasses if empty on component init.
  */
 ngOnInit() {
  if (this.filteredClasses.length === 0) {
   this.filteredClasses = this.classes;
  }
 }

 /**
  * Emits the selected class.
  */
 selectClass(classItem: ClassItem) {
  this.classSelected.emit(classItem);
 }

 /**
  * Emits drag over event.
  */
 onDragOver(event: DragEvent, classItem: ClassItem) {
  this.dragOver.emit({
   event,
   classItem,
  });
 }

 /**
  * Emits drop event.
  */
 onDrop(event: DragEvent, classItem: ClassItem) {
  this.drop.emit({
   event,
   classItem,
  });
 }

 /**
  * Opens modal form to add a new class.
  */
 onAddNewClass() {
  this.modalConfig.title = 'Add Class';
  this.modalConfig.subtitle = 'Enter new class information';
  this.modalConfig.fields.forEach(field => {
   field.value = '';
  });
  const dialogRef = this.dialog.open(ModalFormComponent, {
   data: {
    config: this.modalConfig,
   },
  });
  dialogRef.afterClosed().subscribe(result => {
   if (result) {
    this.classService.createClass(result);
   }
  });
 }

 /**
  * Returns the field object by id.
  */
 getFieldById(id: string): Field {
  return this.fields().find(f => f.id === id)!;
 }

 /**
  * Returns badge class for styling.
  */
 getBadgeClass(index: number): string {
  if (this.selectedField === 'all') {
   return index % 2 === 0 ? 'even' : 'odd';
  }
  return 'even';
 }

 /**
  * Updates modal form field options for field selection.
  */
 updateModalFields() {
  const field = this.modalConfig.fields.find(field => field.key === 'fieldId');
  if (field) {
   field.options = this.fields().map(field => ({
    label: field.name,
    value: field.id,
   }));
  }
 }

 /**
  * Opens modal form to edit a class.
  */
 onEditClass(classItem: ClassItem) {
  this.modalConfig.title = 'Edit Class';
  this.modalConfig.subtitle = 'Edit class information';
  this.modalConfig.fields.forEach(field => {
   field.value = classItem[field.key as keyof ClassItem];
  });
  const dialogRef = this.dialog.open(ModalFormComponent, {
   data: {
    config: this.modalConfig,
   },
  });
  dialogRef.afterClosed().subscribe(result => {
   if (result) {
    this.classService.updateClass(classItem.id, result);
   }
  });
 }

 /**
  * Confirms and deletes a class.
  */
 onDeleteClass(classItem: ClassItem) {
  Swal.fire({
   html: `<strong>${classItem.name}</strong> will be deleted. Are you sure?`,
   icon: 'warning',
   confirmButtonText: 'Yes',
   confirmButtonColor: 'var(--error-600)',
   showCancelButton: true,
   cancelButtonText: 'No',
   cancelButtonColor: 'var(--primary-600)',
   focusCancel: true,
  }).then(result => {
   if (result.isConfirmed) {
    this.classService.deleteClass(classItem.id);
   }
  });
 }
}
