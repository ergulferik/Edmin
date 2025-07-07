import { Component, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideIcons } from '@ng-icons/core';
import { heroPlus, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { ModalFormComponent, ModalFormConfig } from '../../components/modal-form/modal-form';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppButtonComponent } from '../../components/button/button';
import { CourseService } from '../../services/course.service';
import { DataGridComponent, DataGridConfig, DataGridAction } from '../../components/data-grid/data-grid';

@Component({
  selector: 'app-course-definition',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    DataGridComponent,
    AppButtonComponent
],
  templateUrl: './course-definition.html',
  styleUrls: ['./course-definition.scss'],
  viewProviders: [provideIcons({ heroPlus, heroPencil, heroTrash })]
})
export class CourseDefinitionPage {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private courseService = inject(CourseService);

  // Signal tanımlamaları
  courses = signal<Course[]>([]);
  searchTerm = signal<string>('');
  editingCourse = signal<Course | null>(null);

  // Computed signal ile filtrelenmiş kursları hesapla
  filteredCourses = computed(() => {
    const term = this.searchTerm();
    const allCourses = this.courses();
    
    if (!term) return allCourses;
    
    return allCourses.filter(course => 
      course.name.toLowerCase().includes(term.toLowerCase())
    );
  });

  // Data Grid Configuration
  gridConfig: DataGridConfig = {
    title: 'Dersler',
    subtitle: 'Dersleri yönetin (Matematik, Fizik, vb.)',
    columns: [
      { key: 'name', label: 'Ders Adı', type: 'text' }
    ],
    searchPlaceholder: 'Ders adına göre ara...',
    addButtonText: 'Yeni Ders Ekle',
    showAddButton: true,
    showSearch: true,
    maxHeight: '380px'
  };

  // Data Grid Actions
  gridActions: DataGridAction[] = [
    {
      type: 'edit',
      icon: 'heroPencil',
      color: 'primary',
      label: 'Düzenle',
      onClick: (course: Course) => this.editCourse(course)
    },
    {
      type: 'delete',
      icon: 'heroTrash',
      color: 'warn',
      label: 'Sil',
      onClick: (course: Course) => this.deleteCourse(course)
    }
  ];

  // Modal Form Configuration
  modalConfig: ModalFormConfig = {
    title: 'Ders Ekle',
    subtitle: 'Yeni ders bilgilerini girin',
    fields: [
      {
        key: 'name',
        label: 'Ders Adı',
        type: 'text',
        placeholder: 'Örn: Matematik, Fizik, Kimya',
        required: true,
        validators: [
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      }
    ],
    submitText: 'Kaydet',
    cancelText: 'İptal',
    width: '500px'
  };

  constructor() {
    // İlk yükleme effect'i
    effect(() => {
      this.loadCourses();
    });
  }

  async loadCourses() {
    try {
      const coursesData = await this.courseService.getCourses();
      this.courses.set(coursesData || []);
    } catch (error) {
      console.error('Dersler yüklenirken hata oluştu:', error);
      this.courses.set([]);
    }
  }

  onAddClick() {
    this.editingCourse.set(null);
    this.modalConfig.title = 'Yeni Ders Ekle';
    this.modalConfig.subtitle = 'Yeni ders bilgilerini girin';
    this.modalConfig.submitText = 'Ekle';
    this.modalConfig.fields.forEach(field => {
      field.value = '';
    });
    
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: this.modalConfig.width || '500px',
      data: { config: this.modalConfig }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCourse(result);
      }
    });
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm.set(searchTerm);
  }

  editCourse(course: Course) {
    this.editingCourse.set(course);
    this.modalConfig.title = 'Dersi Düzenle';
    this.modalConfig.subtitle = 'Ders bilgilerini güncelleyin';
    this.modalConfig.submitText = 'Güncelle';
    this.modalConfig.fields.forEach(field => {
      field.value = course[field.key as keyof Course];
    });
    
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: this.modalConfig.width || '500px',
      data: { config: this.modalConfig }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCourse(result);
      }
    });
  }

  async addCourse(formData: any) {
    try {
      await this.courseService.createCourse(formData);
      await this.loadCourses(); // Listeyi yenile
    } catch (error) {
      console.error('Ders eklenirken hata oluştu:', error);
    }
  }

  async updateCourse(formData: any) {
    const currentEditingCourse = this.editingCourse();
    if (!currentEditingCourse) return;
    
    try {
      await this.courseService.updateCourse(currentEditingCourse.id, formData);
      await this.loadCourses(); // Listeyi yenile
      this.editingCourse.set(null);
    } catch (error) {
      console.error('Ders güncellenirken hata oluştu:', error);
    }
  }

  async deleteCourse(course: Course) {
    const result = await Swal.fire({
      html: `<strong>${course.name}</strong> dersini silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      confirmButtonText: 'Evet',
      confirmButtonColor: 'var(--primary-600)',
      showCancelButton: true,
      cancelButtonText: 'Hayır',
      cancelButtonColor: 'var(--error-600)'
    });
    
    if (result.isConfirmed) {
      try {
        await this.courseService.deleteCourse(course.id);
        await this.loadCourses(); // Listeyi yenile
      } catch (error) {
        console.error('Ders silinirken hata oluştu:', error);
      }
    }
  }

  goBack() {
    this.router.navigate(['/class-operations']);
  }
} 