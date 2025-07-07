import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamTemplateItemComponent } from '../exam-template-item/exam-template-item';
import { ExamTemplate } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'edmin-exam-template-list',
  templateUrl: './exam-template-list.html',
  styleUrls: ['./exam-template-list.scss'],
  standalone: true,
  imports: [CommonModule, ExamTemplateItemComponent]
})
export class ExamTemplateListComponent {
  @Input() viewMode: 'edit' | 'show' = 'show';
  @Input() selectable: boolean = false;
  @Output() select = new EventEmitter<ExamTemplate>();
  @Output() edit = new EventEmitter<ExamTemplate>();
  @Output() delete = new EventEmitter<string>();
  examTemplates = signal<ExamTemplate[]>([]);

  private examService = inject(ExamService);
  constructor() {
    effect(async () => {
      this.examTemplates.set(await this.examService.getExamTemplates());
    });
  }

  editTemplate(template: ExamTemplate): void {
    this.edit.emit(template);
  }

  deleteTemplate(id: string): void {
    this.delete.emit(id);
  }

  selectTemplate(template: ExamTemplate): void {
    this.select.emit(template);
  }
} 