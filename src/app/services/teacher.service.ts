import { inject, Injectable, signal } from '@angular/core';
import { Teacher as TeacherModel } from '../models/teacher.model';
import { TEACHERS_DATA } from '../data/teacher.data';
import { DcToastService } from 'dc-toast-ng';

/**
 * Teacher service for managing teachers, CRUD operations
 */
@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  teachers = signal<TeacherModel[]>([...TEACHERS_DATA]);
  private toast = inject(DcToastService);
  selectedTeacher = signal<TeacherModel | null>(null);
  getTeachers(): Promise<TeacherModel[]> {
    return Promise.resolve(this.teachers());
  }

  getTeacherById(id: string): Promise<TeacherModel | undefined> {
    return Promise.resolve(this.teachers().find(t => t.id === id));
  }

  createTeacher(teacher: Omit<TeacherModel, 'id'>): Promise<TeacherModel> {
    const newTeacher: TeacherModel = {
      ...teacher,
      id: Math.random().toString(36).substring(2),
    };
    this.teachers.update(teachers => [...teachers, newTeacher]);
    this.toast.create({
      position: 'bottom-center',
      content: `"${teacher.name} ${teacher.surname}" öğretmeni başarıyla eklendi`,
      type: 'success',
      time: 3,
    });
    return Promise.resolve(newTeacher);
  }

  updateTeacher(id: string, teacher: Partial<TeacherModel>): Promise<TeacherModel> {
    const index = this.teachers().findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Teacher not found'));
    }
    this.teachers.update(teachers =>
      teachers.map((t, i) =>
        i === index
          ? {
              ...t,
              ...teacher,
            }
          : t
      )
    );
    this.toast.create({
      position: 'bottom-center',
      content: `"${teacher.name} ${teacher.surname}" öğretmeni başarıyla güncellendi`,
      type: 'success',
      time: 3,
    });
    return Promise.resolve(this.teachers()[index]);
  }

  //Deleting the teacher by id
  deleteTeacher(id: string): Promise<void> {
    const index = this.teachers().findIndex(t => t.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Teacher not found'));
    }
    const teacher = this.teachers()[index];
    this.teachers.update(teachers => teachers.filter((_, i) => i !== index));
    this.toast.create({
      position: 'bottom-center',
      content: `"${teacher.name} ${teacher.surname}" öğretmeni başarıyla silindi`,
      type: 'success',
      time: 3,
    });
    return Promise.resolve();
  }
}
