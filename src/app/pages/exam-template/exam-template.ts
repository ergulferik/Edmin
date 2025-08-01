import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExamTemplate } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import Swal from 'sweetalert2';
import { PageHeaderComponent } from '../../components/page/page-header/page-header';
import { ExamTemplateItemComponent } from './exam-template-item/exam-template-item';
import { ModalHeader } from '../../components/modal/modal-header/modal-header';
import { ModalFooter } from '../../components/modal/modal-footer/modal-footer';
import { ModalFooterButton } from '../../components/modal/modal-footer/modal-footer';
/**
 * Exam template page for managing exam templates
 */
@Component({
 selector: 'edmin-exam-template',
 standalone: true,
 imports: [
  ReactiveFormsModule,
  CommonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  ExamTemplateItemComponent,
  PageHeaderComponent,
  ModalHeader,
  ModalFooter,
 ],
 templateUrl: './exam-template.html',
 styleUrls: ['./exam-template.scss'],
 providers: [
  provideIcons({
   heroXMark,
  }),
 ],
})
export class ExamTemplatePage implements OnInit {
 showForm = false;
 editMode = false;
 editingId: string | null = null;
 templateForm: FormGroup;
 courses: Course[] = [];
 examTemplates = signal<ExamTemplate[]>([]);
 footer = signal<ModalFooterButton[]>([
  {
   title: 'Kaydet',
   disabled: false,
   onClick: () => this.saveTemplate(),
   type: 'submit',
  },
  {
   title: 'İptal',
   disabled: false,
   onClick: () => this.closeForm(),
   type: 'cancel',
  },
 ]);
 examService = inject(ExamService);
 courseService = inject(CourseService);
 fb = inject(FormBuilder);
 constructor() {
  effect(() => {
   this.examTemplates.set(this.examService.examTemplates());
  });

  this.templateForm = this.fb.group({
   name: ['', Validators.required],
   description: [''],
   version: [''],
   courseConfigs: this.fb.array([]),
  });
 }

 async ngOnInit() {
  await this.loadCourses();
 }

 /** Dersleri yükle */
 private async loadCourses() {
  this.courses = await this.courseService.getCourseList();
 }

 /** Formu aç */
 openCreateForm() {
  this.editMode = false;
  this.editingId = null;
  this.templateForm.reset();
  this.courseConfigs.clear();
  this.addCourseConfig();
  this.showForm = true;
 }

 /** Düzenleme için formu aç */
 editTemplate(template: ExamTemplate) {
  this.editMode = true;
  this.editingId = template.id;
  this.templateForm.patchValue({
   name: template.name,
   description: template.description,
   version: template.version,
  });
  this.courseConfigs.clear();
  template.courseConfigs.forEach(cfg => {
   this.courseConfigs.push(
    this.fb.group({
     courseId: [cfg.courseId, Validators.required],
     questionCount: [cfg.questionCount, [Validators.required, Validators.min(1)]],
     weight: [cfg.weight, [Validators.required, Validators.min(0.01)]],
    })
   );
  });
  this.showForm = true;
 }

 /** Formu kapat */
 closeForm() {
  this.showForm = false;
  this.templateForm.reset();
  this.courseConfigs.clear();
 }

 /** Formdaki ders alanlarını döndürür */
 get courseConfigs(): FormArray {
  return this.templateForm.get('courseConfigs') as FormArray;
 }

 /** Yeni ders alanı ekle */
 addCourseConfig() {
  this.courseConfigs.push(
   this.fb.group({
    courseId: ['', Validators.required],
    questionCount: [1, [Validators.required, Validators.min(1)]],
    weight: [1, [Validators.required, Validators.min(0.01)]],
   })
  );
 }

 /** Ders alanını sil */
 removeCourseConfig(index: number) {
  this.courseConfigs.removeAt(index);
 }

 /** Seçili dersleri kontrol et */
 isSelectedCourse(courseId: string): boolean {
  return this.courseConfigs.controls.some(control => control.get('courseId')?.value === courseId);
 }

 /** Şablonu kaydet (ekle/güncelle) */
 async saveTemplate() {
  if (this.templateForm.invalid) return;
  const value = this.templateForm.value;
  if (this.editMode && this.editingId) {
   await this.examService.updateExamTemplate(this.editingId, value);
   this.closeForm();
  } else {
   await this.examService.createExamTemplate(value);
   this.closeForm();
  }
 }

 /** Şablonu sil */
 async deleteTemplate(id: string) {
  const result = await Swal.fire({
   html: `<strong>${(await this.examService.getExamTemplateById(id))?.name}</strong> şablonunu silmek istediğinizden emin misiniz?`,
   icon: 'warning',
   confirmButtonText: 'Evet',
   confirmButtonColor: 'var(--primary-600)',
   showCancelButton: true,
   cancelButtonText: 'Hayır',
   cancelButtonColor: 'var(--error-600)',
  });
  if (result.isConfirmed) {
   this.examService.deleteExamTemplate(id);
  }
 }

 goBack() {
  window.history.back();
 }
}
