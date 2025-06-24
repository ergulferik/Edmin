import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ClassItem, Student, Field } from '../../models/class.model';
import { ClassStore } from '../../stores/class.store';
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
export class Class implements OnInit {
  // Sınıf verileri
  classes: ClassItem[] = [];

  // Öğrenci verileri
  students: Student[] = [];

  // Alan verileri
  fields: Field[] = [];

  // Filtreleme ve arama
  selectedClass: ClassItem | null = null;
  selectedField = "all"

  // Filtrelenmiş veriler
  filteredClasses: ClassItem[] = [];

  dragOverClass: string | null = null;

  classService = inject(ClassService);

  constructor(private classStore: ClassStore, private toast:DcToastService, private helperService: HelperService) { }

  ngOnInit() {
    // Store'dan verileri getValue() ile al
    const state = this.classStore.getValue();
    this.classes = state.classes;
    this.students = state.students;
    this.fields = state.fields;
    this.filteredClasses = this.classes;
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

  // Field güncelleme event handler
  onFieldsUpdated(event: { fields: Field[], selectedField: string }) {
    this.fields = event.fields;
    this.classStore.update({ fields: event.fields });
    this.selectedField = event.selectedField;
    this.onFieldSelected(this.fields.find(f => f.id === this.selectedField)!);
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
        // Öğrencinin sınıfını güncelle
        const updatedStudent = { ...student, classId: classItem.id };

        // Students listesini güncelle
        this.students = this.students.map(s =>
          s.id === student.id ? updatedStudent : s
        );

        // Store'u güncelle
        this.classStore.update({ students: this.students });

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
