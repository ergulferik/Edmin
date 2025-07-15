import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExamTemplate } from '../../models/exam.model';
import { Component, input, signal, inject, output, effect } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'edmin-exam-template-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './exam-template-item.html',
  styleUrls: ['./exam-template-item.scss']
})
export class ExamTemplateItemComponent {
  template = input<ExamTemplate | null>(null);
  viewMode=input<'edit' | 'show'>('show');
  edit = output<ExamTemplate>();
  delete = output<string>();
  courseService = inject(CourseService);
  courseNames = signal<Record<string, string>>({});
  examService = inject(ExamService);
  selected = signal<boolean>(false);
  constructor() {
    this.loadCourseNames();

    effect(() => {
      if(this.examService.getSelectedExam()?.templateId === this.template()?.id) {
        this.selected.set(true);
      } else {
        this.selected.set(false);
      }
    });
  }

  private async loadCourseNames() {
    const courses = await this.courseService.getCourses();
    this.courseNames.set(Object.fromEntries(courses.map(c => [c.id, c.name])));
  }

  onEdit(): void {
    this.edit.emit(this.template()!);
  }

  onDelete(): void {
    this.delete.emit(this.template()?.id || '');
  }
} 