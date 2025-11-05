import { Routes } from '@angular/router';
import { Class } from './pages/class/class';
import { authGuard, authGuardChild } from './guards/auth.guard';

export const routes: Routes = [
 {
  path: '',
  redirectTo: 'login',
  pathMatch: 'full',
 },
 {
  path: 'login',
  loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginPage),
  canActivate: [authGuard],
 },
 {
  path: 'register',
  loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterPage),
  canActivate: [authGuard],
 },
 {
  path: 'class-operations',
  component: Class,
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
 {
  path: 'exam',
  loadComponent: () => import('./pages/exam/exam').then(m => m.ExamPage),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
 {
  path: 'student-detail',
  loadComponent: () => import('./pages/student-detail/student-detail').then(m => m.StudentDetailPage),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
 {
  path: 'course-definition',
  loadComponent: () => import('./pages/course-definition/course-definition').then(m => m.CourseDefinitionPage),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
 {
  path: 'exam-template',
  loadComponent: () => import('./pages/exam-template/exam-template').then(m => m.ExamTemplatePage),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
 {
  path: 'teacher',
  loadComponent: () => import('./pages/teacher/teacher').then(m => m.Teacher),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
 {
  path: 'class/course-schedule',
  loadComponent: () => import('./pages/class/course-schedule/course-schedule').then(m => m.CourseSchedule),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
];
