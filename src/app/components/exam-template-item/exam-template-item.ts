import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExamTemplate } from '../../models/exam.model';
import { Component, input, Input, Output, EventEmitter, signal, inject, computed } from '@angular/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'edmin-exam-template-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './exam-template-item.html',
  styleUrls: ['./exam-template-item.scss']
})
export class ExamTemplateItemComponent {
  template = input<ExamTemplate | null>(null);
  @Input() viewMode: 'edit' | 'show' = 'show';
  @Output() edit = new EventEmitter<ExamTemplate>();
  @Output() delete = new EventEmitter<string>();
  courseService = inject(CourseService);
  courseNames = signal<Record<string, string>>({});

  constructor() {
    this.loadCourseNames();
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