import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClassItem } from '../../../models/class.model';
import { Student } from '../../../models/student.model';
import { ClassService } from '../../../services/class.service';
import { Avatar } from '../../../components/avatar/avatar';

/**
 * StudentList component displays and manages the list of students for a selected class. Supports search, sort, and drag-and-drop.
 */
@Component({
 selector: 'app-student-list',
 imports: [
  CommonModule,
  FormsModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  Avatar,
 ],
 templateUrl: './student-list.html',
 styleUrl: './student-list.scss',
})
/**
 * Provides student list display, search, sort, and drag-and-drop functionality.
 */
export class StudentList implements OnInit {
 /** Currently selected class */
 @Input()
 selectedClass: ClassItem | null = null;
 /** List of all students */
 @Input()
 students: Student[] = [];
 /** Class id for drag-over effect */
 @Input()
 dragOverClass: string | null = null;

 /** Emits when a student is moved to a new class */
 @Output()
 studentMoved = new EventEmitter<{
  student: Student;
  newClassId: string;
 }>();
 /** Emits on drag start event */
 @Output()
 dragStart = new EventEmitter<Student>();
 /** Emits on drag end event */
 @Output()
 dragEnd = new EventEmitter<void>();

 classService = inject(ClassService);

 /** Search term for filtering students */
 searchTerm: string = '';
 /** Sort order for students */
 sortBy: string = 'A-Z';
 /** Filtered students list */
 filteredStudents: Student[] = [];

 /**
  * Initializes the filtered student list on component init.
  */
 ngOnInit() {
  this.updateStudentList();
 }

 /**
  * Updates the filtered student list on input changes.
  */
 ngOnChanges() {
  this.updateStudentList();
 }

 /**
  * Updates the filtered and sorted student list.
  */
 updateStudentList() {
  if (!this.selectedClass) {
   this.filteredStudents = [];
   return;
  }
  let filtered = this.students.filter(s => s.classId === this.selectedClass!.id);
  // Search filter
  if (this.searchTerm) {
   const search = this.searchTerm.toLowerCase();
   filtered = filtered.filter(
    s =>
     s.name.toLowerCase().includes(search) ||
     s.surname.toLowerCase().includes(search) ||
     s.studentNumber.includes(search)
   );
  }
  // Sort
  filtered.sort((a, b) => {
   switch (this.sortBy) {
    case 'A-Z':
     return a.name.localeCompare(b.name);
    case 'Z-A':
     return b.name.localeCompare(a.name);
    case 'studentNumber':
     return a.studentNumber.localeCompare(b.studentNumber);
    default:
     return 0;
   }
  });
  this.filteredStudents = filtered;
 }

 /**
  * Handles search input change.
  */
 onSearchChange() {
  this.updateStudentList();
 }

 /**
  * Handles sort order change.
  */
 onSortChange() {
  this.updateStudentList();
 }

 /**
  * Returns the color for the grade badge.
  */
 getGradeColor(grade: number): string {
  if (grade >= 90) return 'success';
  if (grade >= 80) return 'warning';
  return 'error';
 }

 /**
  * Handles drag start for a student.
  */
 onDragStart(event: DragEvent, student: Student) {
  // Create a simple and clean drag preview
  const preview = document.createElement('div');
  preview.className = 'drag-preview';
  preview.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      background: white;
      border: 2px solid #007bff;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: inherit;
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      z-index: 10000;
      pointer-events: none;
      transform: rotate(2deg);
      opacity: 0.9;
    `;
  // Add student info
  preview.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="
          width: 32px;
          height: 32px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        ">${student.name.charAt(0)}${student.surname.charAt(0)}</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 2px;">${student.name} ${student.surname}</div>
          <div style="font-size: 12px; color: #666;">${student.studentNumber}</div>
        </div>
      </div>
    `;
  document.body.appendChild(preview);
  // Set drag image
  event.dataTransfer!.effectAllowed = 'move';
  event.dataTransfer!.setDragImage(preview, 20, 20);
  // Emit drag start event to parent
  this.dragStart.emit(student);
  // Fade the original element
  const originalElement = event.target as HTMLElement;
  originalElement.style.opacity = '0.5';
 }

 /**
  * Handles drag end for a student.
  */
 onDragEnd() {
  // Emit drag end event to parent
  this.dragEnd.emit();
  // Restore opacity of the original element
  const originalElement = document.querySelector(`[data-student-id]`) as HTMLElement;
  if (originalElement) {
   originalElement.style.opacity = '1';
  }
  // Remove all drag-preview elements
  const previews = document.querySelectorAll('.drag-preview');
  previews.forEach(preview => preview.remove());
 }
}
