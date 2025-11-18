import { Routes } from '@angular/router';
import { Class } from './pages/class/class';
import { authGuard, authGuardChild } from './guards/auth.guard';
import { permissionGuard, permissionGuardChild } from './guards/permission.guard';

export const sidebarRoutes: Routes = [
 {
  path: 'class-operations',
  component: Class,
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'class_view' },
 },
 {
  path: 'exam',
  loadComponent: () => import('./pages/exam/exam').then(m => m.ExamPage),
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'exam_view' },
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
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'course_view' },
 },
 {
  path: 'exam-template',
  loadComponent: () => import('./pages/exam-template/exam-template').then(m => m.ExamTemplatePage),
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'exam_template_view' },
 },
 {
  path: 'teacher',
  loadComponent: () => import('./pages/teacher/teacher').then(m => m.Teacher),
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'teacher_view' },
 },
 {
  path: 'role-management',
  loadComponent: () => import('./pages/management/role-management/role-management').then(m => m.RoleManagementPage),
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'role_view' },
 },
 {
  path: 'users',
  loadComponent: () => import('./pages/management/users/users').then(m => m.UsersPage),
  canActivate: [authGuard, permissionGuard],
  canActivateChild: [authGuardChild, permissionGuardChild],
  data: { permission: 'user_view' },
 },
 {
  path: 'add-student',
  loadComponent: () => import('./pages/management/users/add/add-student/add-student').then(m => m.AddStudent),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
  data: { permission: 'student_add' },
 },

 {
  path: 'class/course-schedule',
  loadComponent: () => import('./pages/class/course-schedule/course-schedule').then(m => m.CourseSchedule),
  canActivate: [authGuard],
  canActivateChild: [authGuardChild],
 },
];

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
  path: 'unauthorized',
  loadComponent: () => import('./pages/unauthorized/unauthorized').then(m => m.UnauthorizedPage),
 },
 ...sidebarRoutes,
];
