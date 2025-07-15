import { Component, effect, signal, output, inject } from '@angular/core';
import { ExamTemplate } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';
import { ExamTemplateItemComponent } from '../exam-template/exam-template-item/exam-template-item';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalHeader } from '../../components/modal/modal-header/modal-header';

/**
 * Exam template list component for managing exam templates
 */
@Component({
  selector: 'edmin-exam-template-list',
  imports: [ExamTemplateItemComponent, ModalHeader],
  template: `
    <edmin-modal-header
      title="Şablon Seç"
      subtitle="Kullanılacak şablonu seçiniz"
      (onClose)="dialogRef.close()"
    ></edmin-modal-header>
    <div
      style="display: flex; flex-direction: row; gap: 1rem; flex-wrap: wrap; justify-content: center; margin: 1rem auto;"
    >
      @for (template of examTemplates(); track template.id) {
        <edmin-exam-template-item
          style="cursor: pointer; display:block;"
          [template]="template"
          [viewMode]="'show'"
          (click)="selectTemplate(template)"
        >
        </edmin-exam-template-item>
      }
    </div>
  `,
})
export class ExamTemplateListComponent {
  examService = inject(ExamService);
  data = inject(MAT_DIALOG_DATA);
  examTemplates = signal<ExamTemplate[]>([]);
  selectedTemplate = signal<ExamTemplate | null>(null);
  select = output<ExamTemplate>();
  dialogRef = inject(MatDialogRef<ExamTemplateListComponent>);
  constructor() {
    effect(() => {
      this.examTemplates.set(this.examService.examTemplates());
    });
    if (this.data && this.data.selectedTemplate) {
      this.selectedTemplate.set(this.data.selectedTemplate);
    }
  }

  selectTemplate(template: ExamTemplate): void {
    if (this.examService.getSelectedExam()?.templateId === template.id) {
      return;
    }
    if (this.examService.getSelectedExam()) {
      this.examService.setSelectedExam({
        ...this.examService.getSelectedExam()!,
        templateId: template.id,
      });
    }
    this.selectedTemplate.set(template);
    this.select.emit(template);
    this.dialogRef.close(template);
  }
}
