import { Routes } from '@angular/router';
import { Class } from './pages/class/class';

export const routes: Routes = [
 {
  path: '',
  redirectTo: 'class-operations',
  pathMatch: 'full',
 },
 {
  path: 'class-operations',
  component: Class,
 },
 {
  path: 'exam',
  loadComponent: () => import('./pages/exam/exam').then(m => m.ExamPage),
 },
 {
  path: 'student-detail',
  loadComponent: () => import('./pages/student-detail/student-detail').then(m => m.StudentDetailPage),
 },
 {
  path: 'course-definition',
  loadComponent: () => import('./pages/course-definition/course-definition').then(m => m.CourseDefinitionPage),
 },
 {
  path: 'exam-template',
  loadComponent: () => import('./pages/exam-template/exam-template').then(m => m.ExamTemplatePage),
 },
 {
  path: 'teacher',
  loadComponent: () => import('./pages/teacher/teacher').then(m => m.Teacher),
 },
];
