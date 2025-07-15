import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Exam, ExamTemplate } from '../../models/exam.model';
import { DataGridAction, DataGridComponent, DataGridConfig } from '../../components/data-grid/data-grid';
import { ExamService } from '../../services/exam.service';
import { ModalFormComponent, ModalFormConfig } from '../../components/modal/modal-form/modal-form';
import Swal from 'sweetalert2';
import { PageHeaderComponent } from '../../components/page/page-header/page-header';
import { ExamTemplateListComponent } from './exam-template-list';

/**
 * Exam page for managing exams
 */
@Component({
 selector: 'app-exam',
 templateUrl: './exam.html',
 styleUrls: ['./exam.scss'],
 standalone: true,
 imports: [
  CommonModule,
  ReactiveFormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatTooltipModule,
  DataGridComponent,
  PageHeaderComponent,
 ],
})
export class ExamPage {
 opticalForm: File | null = null;
 isDragOver = false;
 exams = signal<Exam[]>([]);
 editingExam?: Exam;
 examTemplates = signal<ExamTemplate[]>([]);

 dialog = inject(MatDialog);
 examService = inject(ExamService);

 constructor() {
  effect(() => {
   this.loadExams();
  });
 }

 async loadExams() {
  this.exams.set((await this.examService.getExams()) || []);
  this.examTemplates.set((await this.examService.getExamTemplates()) || []);

  this.setGridConfig();
 }

 gridConfig!: DataGridConfig;

 gridActions: DataGridAction[] = [
  {
   type: 'edit',
   icon: 'heroPencilSquare',
   color: 'primary',
   label: 'Düzenle',
   onClick: (exam: Exam) => this.editExam(exam),
  },
  {
   type: 'delete',
   icon: 'heroTrash',
   color: 'warn',
   label: 'Sil',
   onClick: (exam: Exam) => this.deleteExam(exam),
  },
 ];

 // Modal Form Configuration
 modalConfig: ModalFormConfig = {
  title: 'Sınav Ekle',
  subtitle: 'Yeni sınav bilgilerini girin',
  fields: [
   {
    key: 'templateId',
    label: 'Şablon',
    type: 'template',
    placeholder: 'Şablon Seç',
    template: {
     component: ExamTemplateListComponent,
     displayExpr: 'name',
     keyExpr: 'id',
    },
   },
   {
    key: 'name',
    label: 'Sınav Adı',
    type: 'text',
    placeholder: 'Örn: Matematik Final Sınavı',
    required: true,
    validators: [Validators.minLength(2), Validators.maxLength(50)],
   },
   {
    key: 'code',
    label: 'Sınav Kodu',
    type: 'text',
    placeholder: 'Örn: MAT2024-01',
    required: true,
   },
   {
    key: 'date',
    label: 'Sınav Tarihi',
    type: 'date',
    placeholder: 'Örn: 2024-01-01',
    required: true,
    validators: [Validators.minLength(10), Validators.maxLength(10)],
   },
   {
    key: 'durationInMinutes',
    label: 'Süre',
    type: 'number',
    placeholder: 'Örn: 120',
    required: true,
   },
   {
    key: 'answerKeyFileUrl',
    label: 'Cevap Anahtarı',
    type: 'file',
    placeholder: 'Cevap Anahtarı Seç',
   },
  ],
  submitText: 'Kaydet',
  cancelText: 'İptal',
  width: '500px',
 };

 setGridConfig() {
  this.gridConfig = {
   title: 'Sınavlar',
   subtitle: 'Sınavları yönetin',
   columns: [
    {
     key: 'name',
     label: 'Sınav Adı',
     type: 'text',
    },
    {
     key: 'code',
     label: 'Sınav Kodu',
     type: 'text',
    },
    {
     key: 'date',
     label: 'Sınav Tarihi',
     type: 'date',
    },
    {
     key: 'durationInMinutes',
     label: 'Süre',
     type: 'number',
    },
    {
     key: 'templateId',
     label: 'Şablon',
     type: 'template',
     data: this.examTemplates(),
     keyExpr: 'id',
     displayExpr: 'name',
    },
    {
     key: 'answerKeyFileUrl',
     label: 'Cevap Anahtarı',
     type: 'file',
    },
    {
     key: 'isActive',
     label: 'Aktif',
     type: 'boolean',
    },
   ],
   searchPlaceholder: 'Sınav adına göre ara...',
   searchableColumns: ['name', 'code'],
   addButtonText: 'Yeni Sınav Ekle',
   showAddButton: true,
   showSearch: true,
   maxHeight: '380px',
  };
 }

 async editExam(exam: Exam) {
  this.editingExam = exam;
  this.modalConfig.title = 'Sınav Düzenle';
  this.modalConfig.subtitle = 'Sınav bilgilerini düzenleyin';
  this.modalConfig.submitText = 'Kaydet';
  this.examService.setSelectedExam(exam);
  this.assignFieldValues();

  const dialogRef = this.dialog.open(ModalFormComponent, {
   width: this.modalConfig.width || '500px',
   data: {
    config: this.modalConfig,
   },
  });

  dialogRef.afterClosed().subscribe(result => {
   if (result) {
    this.updateExam(result);
   }
   this.examService.setSelectedExam(null);
  });
 }

 onAddClick(): void {
  console.log('Adding exam');
  this.modalConfig.title = 'Yeni Sınav Ekle';
  this.modalConfig.subtitle = 'Yeni sınav bilgilerini girin';
  this.modalConfig.submitText = 'Ekle';
  this.examService.setSelectedExam({
   id: '',
   name: '',
   code: '',
   date: new Date(),
   templateId: '',
   isActive: true,
  });

  this.assignFieldValues();

  const dialogRef = this.dialog.open(ModalFormComponent, {
   width: this.modalConfig.width || '500px',
   data: {
    config: this.modalConfig,
   },
  });

  dialogRef.afterClosed().subscribe(result => {
   if (result) {
    this.createExam(result);
   }
   this.examService.setSelectedExam(null);
  });
 }

 async assignFieldValues() {
  const template = await this.examService.getExamTemplateById(this.examService.getSelectedExam()?.templateId || '');

  this.modalConfig.fields.forEach(field => {
   field.value = this.examService.getSelectedExam()?.[field.key as keyof Exam] || '';
   if (field.type === 'template' && field.template) {
    if (template) {
     field.template.displayValue = template?.name || '';
     field.value = template.id;
    } else {
     field.template.displayValue = '';
     field.value = '';
    }
   }
  });
 }

 async deleteExam(exam: Exam) {
  const result = await Swal.fire({
   html: `<strong>${exam.name}</strong> sınavını silmek istediğinizden emin misiniz?`,
   icon: 'warning',
   confirmButtonText: 'Evet',
   confirmButtonColor: 'var(--primary-600)',
   showCancelButton: true,
   cancelButtonText: 'Hayır',
   cancelButtonColor: 'var(--error-600)',
  });

  if (result.isConfirmed) {
   try {
    await this.examService.deleteExam(exam.id);
   } catch (error) {
    console.error('Sınav silinirken hata oluştu:', error);
   }
  }
 }

 createExam(formData: any): void {
  try {
   this.examService.createExam(formData);
  } catch (error) {
   console.error('Error creating exam:', error);
  }
 }

 updateExam(formData: any): void {
  if (!this.editingExam) return;
  try {
   this.examService.updateExam(this.editingExam.id, formData);
  } catch (error) {
   console.error('Error updating exam:', error);
  }
 }
}
