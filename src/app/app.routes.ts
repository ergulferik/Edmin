import { Routes } from '@angular/router';
import { Class } from './pages/class/class';
import { ExamTemplatePage } from './pages/exam-template/exam-template';

export const routes: Routes = [
  { path: '', redirectTo: 'class-operations', pathMatch: 'full' },
  { path: 'class-operations', component: Class },
  {
    path: 'class-definition',
    loadComponent: () => import('./pages/class-definition/class-definition').then(m => m.ClassDefinitionPage)
  },
  {
    path: 'exam-create',
    loadComponent: () => import('./pages/exam-create/exam-create').then(m => m.ExamCreatePage)
  },
  {
    path: 'student-detail',
    loadComponent: () => import('./pages/student-detail/student-detail').then(m => m.StudentDetailPage)
  },
  {
    path: 'course-definition',
    loadComponent: () => import('./pages/course-definition/course-definition').then(m => m.CourseDefinitionPage)
  },
  {
    path: 'exam-template',
    loadComponent: () => import('./pages/exam-template/exam-template').then(m => m.ExamTemplatePage)
  }
];
