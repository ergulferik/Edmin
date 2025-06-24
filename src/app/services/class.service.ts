import { Injectable, signal } from '@angular/core';
import { ClassStore } from '../stores/class.store';
import { Student } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private classStore: ClassStore) { }

  draggedStudent = signal<Student | null>(null);

}
