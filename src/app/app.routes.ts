import { Routes } from '@angular/router';
import { Class } from './pages/class/class';
export const routes: Routes = [
  { path: '', redirectTo: 'class-operations', pathMatch: 'full' },
  { path: 'class-operations', component: Class }
];
