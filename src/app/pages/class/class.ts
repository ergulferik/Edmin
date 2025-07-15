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
import { HelperService } from '../../services/helper.service';
import { FieldComponent } from '../../components/field/field';
import { ClassList } from '../../components/class-list/class-list';
import { StudentList } from '../../components/student-list/student-list';
import { ClassService } from '../../services/class.service';
import { DcToastService } from 'dc-toast-ng';
import Swal from 'sweetalert2';

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
    StudentList
  ],
  templateUrl: './class.html',
  styleUrl: './class.scss'
})
export class Class {
  // Sınıf verileri
  classes: ClassItem[] = [];

  // Öğrenci verileri
  students: Student[] = [];

  // Filtreleme ve arama
  selectedClass: ClassItem | null = null;
  selectedField = "all"

  // Filtrelenmiş veriler
  filteredClasses: ClassItem[] = [];

  dragOverClass: string | null = null;

  classService = inject(ClassService);

  constructor(private toast:DcToastService) {
    effect(async () => {
      this.classes = await this.classService.getClasses();
      this.students = await this.classService.getStudents();
      this.filteredClasses = this.selectedField === 'all'
      ? this.classes
      : this.classes.filter(c => c.fieldId === this.selectedField);
    });
  }

  // Sınıf seçimi
  selectClass(classItem: ClassItem) {
    this.selectedClass = classItem;
  }

  // Field seçimi event handler
  onFieldSelected(field: Field) {
    this.selectedField = field.id;
    this.filteredClasses = field.id === 'all'
      ? this.classes
      : this.classes.filter(c => c.fieldId === this.selectedField);
  }

  onDragOver(event: DragEvent, classItem: ClassItem) {
    if (this.classService.draggedStudent()?.classId !== classItem.id) {
      event.preventDefault();
    }
  }

  onDragStart(student: Student) {
    this.classService.draggedStudent.set(student);
  }

  onDragEnd() {
    this.classService.draggedStudent.set(null);
    this.dragOverClass = null;
  }

  async onDrop(event: DragEvent, classItem: ClassItem) {
    if(!event) return;
    event.preventDefault();
    const student = this.classService.draggedStudent();
    const result = await Swal.fire({
      html: `<strong>${student?.name} ${student?.surname}</strong> öğrencisini <strong>${classItem.name}</strong> sınıfına taşımak istediğinizden emin misiniz?`,
      icon: 'warning',
      confirmButtonText: 'Evet',
      confirmButtonColor: 'var(--primary-600)',
      showCancelButton: true,
      cancelButtonText: 'Hayır',
      cancelButtonColor: 'var(--error-600)'
    })
    if (result.isConfirmed) {
      if (student && classItem) {
        const updatedStudent = { ...student, classId: classItem.id };
        this.classService.updateStudent(student.id, { classId: classItem.id });

        this.onDragEnd()

        // Başarı mesajı göster
        this.toast.create({
          position:'bottom-center',
          content:`${student.name} ${student.surname} ${classItem.name} sınıfına taşındı`,
          type:'success',
          time:3,
          allowTimeBar:true
        })

      }
    }
  }

  addNewClass() {
    this.selectedClass = null;
  }
}
