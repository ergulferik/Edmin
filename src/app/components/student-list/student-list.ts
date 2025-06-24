import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Student, ClassItem } from '../../models/class.model';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-student-list',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export class StudentList implements OnInit {
  @Input() selectedClass: ClassItem | null = null;
  @Input() students: Student[] = [];
  @Input() dragOverClass: string | null = null;

  @Output() studentMoved = new EventEmitter<{ student: Student, newClassId: string }>();
  @Output() dragStart = new EventEmitter<Student>();
  @Output() dragEnd = new EventEmitter<void>();

  classService = inject(ClassService);

  // Filtreleme ve arama
  searchTerm: string = '';
  sortBy: string = 'A-Z';

  // Filtrelenmiş veriler
  filteredStudents: Student[] = [];

  ngOnInit() {
    this.updateStudentList();
  }

  ngOnChanges() {
    this.updateStudentList();
  }

  // Öğrenci listesini güncelle
  updateStudentList() {
    if (!this.selectedClass) {
      this.filteredStudents = [];
      return;
    }

    let filtered = this.students.filter(s => s.classId === this.selectedClass!.id);

    // Arama filtresi
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.surname.toLowerCase().includes(search) ||
        s.studentNumber.includes(search)
      );
    }

    // Sıralama
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

  // Arama değişikliği
  onSearchChange() {
    this.updateStudentList();
  }

  // Sıralama değişikliği
  onSortChange() {
    this.updateStudentList();
  }

  // Not ortalaması rengini belirle
  getGradeColor(grade: number): string {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'warning';
    return 'error';
  }

  onDragStart(event: DragEvent, student: Student) {
    // Basit ve temiz bir drag preview oluştur
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

    // Öğrenci bilgilerini ekle
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

    // Drag image'i ayarla
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setDragImage(preview, 20, 20);

    // Parent component'e drag start event'ini gönder
    this.dragStart.emit(student);

    // Orijinal elementi hafifçe soluklaştır
    const originalElement = event.target as HTMLElement;
    originalElement.style.opacity = '0.5';
  }

  onDragEnd() {
    // Parent component'e drag end event'ini gönder
    this.dragEnd.emit();

    // Orijinal elementin opacity'sini geri yükle
    const originalElement = document.querySelector(`[data-student-id]`) as HTMLElement;
    if (originalElement) {
      originalElement.style.opacity = '1';
    }

    // Sadece drag-preview class'ına sahip elementleri temizle
    const previews = document.querySelectorAll('.drag-preview');
    previews.forEach(preview => preview.remove());
  }
}
