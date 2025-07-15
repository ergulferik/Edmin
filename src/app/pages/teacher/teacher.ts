import { Component, computed, effect, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../components/page/page-header/page-header';
import { DataGridAction, DataGridComponent, DataGridConfig } from '../../components/data-grid/data-grid';
import { Teacher as TeacherModel } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';
import { TeacherEditForm } from './teacher-edit-form/teacher-edit-form';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

/**
 * Teacher page for managing teachers
 */
@Component({
 selector: 'app-teacher',
 imports: [PageHeaderComponent, DataGridComponent],
 standalone: true,
 templateUrl: './teacher.html',
 styleUrl: './teacher.scss',
})
export class Teacher {
 dialog = inject(MatDialog);
 teacherService = inject(TeacherService);
 teachers = signal<TeacherModel[]>([]);
 searchTerm = signal<string>('');
 gridConfig: DataGridConfig = {
  title: 'Öğretmenler',
  subtitle: 'Öğretmenleri yönetin',
  columns: [
   {
    key: 'image',
    label: 'Fotoğraf',
    type: 'avatar',
    sortable: true,
    alternative: teacher => {
     return teacher.name.charAt(0) + teacher.surname.charAt(0);
    },
   },
   {
    key: 'name',
    label: 'Adı',
    type: 'text',
    sortable: true,
   },
   {
    key: 'surname',
    label: 'Soyadı',
    type: 'text',
    sortable: true,
   },
   {
    key: 'email',
    label: 'Email',
    type: 'text',
    sortable: true,
   },
   {
    key: 'phone',
    label: 'Telefon',
    type: 'text',
    sortable: true,
   },
   {
    key: 'isActive',
    label: 'Aktif',
    type: 'boolean',
    sortable: true,
   },
  ],
  searchableColumns: ['name', 'surname', 'email', 'phone'],
  addButtonText: 'Yeni Öğretmen Ekle',
  showAddButton: true,
  showSearch: true,
  maxHeight: '500px',
  addButtonType: 'primary',
 };

 gridActions: DataGridAction[] = [
  {
   type: 'edit',
   icon: 'heroPencilSquare',
   color: 'primary',
   label: 'Düzenle',
   onClick: (item: TeacherModel) => this.onEditClick(item),
  },
  {
   type: 'delete',
   icon: 'heroTrash',
   color: 'warn',
   label: 'Sil',
   onClick: (item: TeacherModel) => this.onDeleteClick(item),
  },
 ];

 filteredTeachers = computed(() => {
  const term = this.searchTerm();
  const allTeachers = this.teachers();

  if (!term) return allTeachers;

  return allTeachers.filter(
   teacher =>
    teacher.name.toLowerCase().includes(term.toLowerCase()) ||
    teacher.surname.toLowerCase().includes(term.toLowerCase()) ||
    teacher.email.toLowerCase().includes(term.toLowerCase()) ||
    teacher.phone.toLowerCase().includes(term.toLowerCase())
  );
 });

 constructor() {
  effect(() => {
   this.teachers.set(this.teacherService.teachers());
  });
 }

 onAddClick() {
  const dialogRef = this.dialog.open(TeacherEditForm, {
   width: '80%',
  });
  dialogRef.afterClosed().subscribe(result => {
   if (result) {
    this.teacherService.createTeacher(result);
    this.teacherService.selectedTeacher.set(null);
   }
  });
 }

 onEditClick(item: TeacherModel) {
  this.teacherService.selectedTeacher.set(item);
  const dialogRef = this.dialog.open(TeacherEditForm, {
   width: '80%',
  });
  dialogRef.afterClosed().subscribe(result => {
   if (result) {
    this.teacherService.updateTeacher(item.id, result);
    this.teacherService.selectedTeacher.set(null);
   }
  });
 }

 onDeleteClick(item: TeacherModel) {
  Swal.fire({
   html: `<strong>${item.name} ${item.surname}</strong> öğretmenini silmek istediğinizden emin misiniz?`,
   icon: 'warning',
   confirmButtonText: 'Evet',
   confirmButtonColor: 'var(--error-600)',
   showCancelButton: true,
   cancelButtonText: 'Hayır',
   cancelButtonColor: 'var(--primary-600)',
   focusCancel: true,
  }).then(result => {
   if (result.isConfirmed) {
    this.teacherService.deleteTeacher(item.id);
   }
  });
 }

 onSearchChange(event: string) {
  this.searchTerm.set(event);
 }

 /**
  * Görüntülenecek resim kaynağını döndürür.
  * Eğer image yoksa veya hatalıysa, column.alternative fonksiyonunu kullanır.
  */
 getImageSrc(element: any, column: any): string {
  const value = element[column.key];
  if (value) {
   return value;
  }
  if (typeof column.alternative === 'function') {
   return column.alternative(element);
  }
  // Varsayılan bir resim de dönebilirsiniz
  return 'assets/images/avatar-male-blue.png';
 }

 /**
  * Resim yüklenemezse alternatif resmi gösterir.
  */
 onImageError(event: Event, element: any, column: any) {
  const imgElement = event.target as HTMLImageElement;
  if (typeof column.alternative === 'function') {
   imgElement.src = column.alternative(element);
  } else {
   imgElement.src = 'assets/images/avatar-male-blue.png';
  }
 }
}
