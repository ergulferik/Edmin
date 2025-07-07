import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentExamResult } from '../../models/exam.model';
import { map } from 'rxjs/operators';
import { ExamService } from '../../services/exam.service';
import { Student } from '../../models/student.model';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-detail.html',
  styleUrls: ['./student-detail.scss']
})
export class StudentDetailPage {
  examService = inject(ExamService);
  classService = inject(ClassService);
  selectedStudentId = '1';
  selectedExamResult: StudentExamResult | null = null;
  isEditingAnswers = false;

  students?:Student[]

  constructor() {
    effect(async () => {
      this.students = await this.classService.getStudents();
    });
  }

  getStudentExamResults(studentId: string) {
    return this.examService.getStudentExamResults().then(results => results.filter(result => result.studentId === studentId));
  }

  getExamName(examId: string) {
    return this.examService.getExams().then(exams => exams.find(exam => exam.id === examId)?.name || 'Unknown Exam');
  }

  onExamResultChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const resultId = target.value;
    if (resultId) {
      this.getStudentExamResults(this.selectedStudentId).then(results => {
        const result = results.find(r => r.id === resultId);
        if (result) {
          this.selectedExamResult = result;
        }
      });
    }
  }

  onAnswerChange(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const newAnswer = target.value;
    this.updateAnswer(index, newAnswer);
  }

  updateAnswer(index: number, newAnswer: string) {
    if (this.selectedExamResult) {
      const updatedAnswers = [...this.selectedExamResult.answers];
      updatedAnswers[index] = {
        ...updatedAnswers[index],
        selectedOption: newAnswer,
        isCorrect: newAnswer === updatedAnswers[index].correctOption
      };

      this.examService.updateStudentExamResult(this.selectedExamResult.id, { answers: updatedAnswers }).then(result => this.selectedExamResult = result);
    }
  }

  toggleAnswerEditing() {
    this.isEditingAnswers = !this.isEditingAnswers;
  }
} 