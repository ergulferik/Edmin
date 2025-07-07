import { DestroyRef, Injectable, signal } from '@angular/core';
import { delay } from 'rxjs/operators';
import { ExamTemplate, Exam, StudentExamResult } from '../models/exam.model';
import { EXAM_TEMPLATES_DATA, EXAMS_DATA, STUDENT_EXAM_RESULTS_DATA } from '../data/exam.data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  // In-memory data storage (will be replaced with API calls)
  private examTemplates = signal<ExamTemplate[]>([...EXAM_TEMPLATES_DATA]);
  private exams = signal<Exam[]>([...EXAMS_DATA]);
  private studentExamResults = signal<StudentExamResult[]>([...STUDENT_EXAM_RESULTS_DATA]);

  // Exam Template CRUD Operations
  getExamTemplates(): Promise<ExamTemplate[]> {
    // TODO: Replace with API call: return this.http.get<ExamTemplate[]>('/api/exam-templates')
    return Promise.resolve(this.examTemplates());
  }

  getExamTemplateById(id: string): Promise<ExamTemplate | undefined> {
    // TODO: Replace with API call: return this.http.get<ExamTemplate>(`/api/exam-templates/${id}`)
    const template = this.examTemplates().find(t => t.id === id);
    return Promise.resolve(template);
  }

  createExamTemplate(template: Omit<ExamTemplate, 'id'>): Promise<ExamTemplate> {
    // TODO: Replace with API call: return this.http.post<ExamTemplate>('/api/exam-templates', template)
    const newTemplate: ExamTemplate = {
      ...template,
      id: Math.random().toString(36).substring(2)
    };
    this.examTemplates.update(templates => [...templates, newTemplate]);
    return Promise.resolve(newTemplate);
  }

  updateExamTemplate(id: string, template: Partial<ExamTemplate>): Promise<ExamTemplate> {
    // TODO: Replace with API call: return this.http.put<ExamTemplate>(`/api/exam-templates/${id}`, template)
    const index = this.examTemplates().findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Exam template not found'));
    }
    this.examTemplates.update(templates => templates.map((t, i) => i === index ? { ...t, ...template } : t));
    return Promise.resolve(this.examTemplates()[index]);
  }

  deleteExamTemplate(id: string): Promise<void> {
    // TODO: Replace with API call: return this.http.delete<void>(`/api/exam-templates/${id}`)
    const index = this.examTemplates().findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Exam template not found'));
    }
    this.examTemplates.update(templates => templates.filter((_, i) => i !== index));
    return Promise.resolve();
  }

  // Exam CRUD Operations
  getExams(): Promise<Exam[]> {
    // TODO: Replace with API call: return this.http.get<Exam[]>('/api/exams')
    return Promise.resolve(this.exams());
  }

  getExamById(id: string): Promise<Exam | undefined> {
    // TODO: Replace with API call: return this.http.get<Exam>(`/api/exams/${id}`)
    const exam = this.exams().find(e => e.id === id);
    return Promise.resolve(exam);
  }

  createExam(exam: Omit<Exam, 'id'>): Promise<Exam> {
    // TODO: Replace with API call: return this.http.post<Exam>('/api/exams', exam)
    const newExam: Exam = {
      ...exam,
      id: Math.random().toString(36).substring(2)
    };
    this.exams.update(exams => [...exams, newExam]);
    return Promise.resolve(newExam);
  }

  updateExam(id: string, exam: Partial<Exam>): Promise<Exam> {
    // TODO: Replace with API call: return this.http.put<Exam>(`/api/exams/${id}`, exam)
    const index = this.exams().findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Exam not found'));
    }
    this.exams.update(exams => exams.map((e, i) => i === index ? { ...e, ...exam } : e));
    return Promise.resolve(this.exams()[index]);
  }

  deleteExam(id: string): Promise<void> {
    // TODO: Replace with API call: return this.http.delete<void>(`/api/exams/${id}`)
    const index = this.exams().findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Exam not found'));
    }
    this.exams.update(exams => exams.filter((_, i) => i !== index));
    return Promise.resolve();
  }

  // Student Exam Result CRUD Operations
  getStudentExamResults(): Promise<StudentExamResult[]> {
    // TODO: Replace with API call: return this.http.get<StudentExamResult[]>('/api/student-exam-results')
    return Promise.resolve(this.studentExamResults());
  }

  getStudentExamResultsByStudentId(studentId: string): Promise<StudentExamResult[]> {
    // TODO: Replace with API call: return this.http.get<StudentExamResult[]>(`/api/student-exam-results?studentId=${studentId}`)
    const results = this.studentExamResults().filter(r => r.studentId === studentId);
    return Promise.resolve(results);
  }

  getStudentExamResultById(id: string): Promise<StudentExamResult | undefined> {
    // TODO: Replace with API call: return this.http.get<StudentExamResult>(`/api/student-exam-results/${id}`)
    const result = this.studentExamResults().find(r => r.id === id);
    return Promise.resolve(result);
  }

  createStudentExamResult(result: Omit<StudentExamResult, 'id'>): Promise<StudentExamResult> {
    // TODO: Replace with API call: return this.http.post<StudentExamResult>('/api/student-exam-results', result)
    const newResult: StudentExamResult = {
      ...result,
      id: Math.random().toString(36).substring(2)
    };
    this.studentExamResults.update(results => [...results, newResult]);
    return Promise.resolve(newResult);
  }

  updateStudentExamResult(id: string, result: Partial<StudentExamResult>): Promise<StudentExamResult> {
    // TODO: Replace with API call: return this.http.put<StudentExamResult>(`/api/student-exam-results/${id}`, result)
    const index = this.studentExamResults().findIndex(r => r.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Student exam result not found'));
    }
    this.studentExamResults.update(results => results.map((r, i) => i === index ? { ...r, ...result } : r));
    return Promise.resolve(this.studentExamResults()[index]);
  }

  deleteStudentExamResult(id: string): Promise<void> {
    // TODO: Replace with API call: return this.http.delete<void>(`/api/student-exam-results/${id}`)
    const index = this.studentExamResults().findIndex(r => r.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Student exam result not found'));
    }
    this.studentExamResults.update(results => results.filter((_, i) => i !== index));
    return Promise.resolve();
  }

  // Utility methods
  uploadOpticalForm(file: File): Promise<string> {
    // TODO: Replace with actual file upload API call
    // return this.http.post<string>('/api/upload-optical-form', formData)
    return Promise.resolve(`/assets/uploads/${file.name}`);
  }

  calculateExamResults(studentAnswers: any[], answerKey: any[]): Promise<any> {
    // TODO: Replace with server-side calculation API call
    // return this.http.post<any>('/api/calculate-results', { studentAnswers, answerKey })
    return Promise.resolve({ totalScore: 85.5, totalNet: 30.0, statistics: [] });
  }
}
