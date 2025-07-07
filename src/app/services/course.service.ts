import { inject, Injectable, signal } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { COURSES_DATA } from '../data/class.data';
import { DcToastService } from 'dc-toast-ng';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private courses = signal<Course[]>([...COURSES_DATA]);
  private toast = inject(DcToastService);
  getCourses(): Promise<Course[]> {
    return Promise.resolve(this.courses());
  }

  getCourseById(id: string): Promise<Course | undefined> {
    const course = this.courses().find(c => c.id === id);
    return Promise.resolve(course);
  }

  createCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: Math.random().toString(36).substring(2)
    };
    this.courses.update(courses => [...courses, newCourse]);
    this.toast.create({
      position: 'bottom-center',
      content: `"${course.name}" dersi başarıyla eklendi`,
      type: 'success',
      time: 3
    });
    return Promise.resolve(newCourse);
  }

  updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const index = this.courses().findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Course not found'));
    }
    this.courses.update(courses => courses.map((c, i) => i === index ? { ...c, ...course } : c));
    this.toast.create({
      position: 'bottom-center',
      content: `"${course.name}" dersi başarıyla güncellendi`,
      type: 'success',
      time: 3
    });
    return Promise.resolve(this.courses()[index]);
  }

  deleteCourse(id: string): Promise<void> {
    const index = this.courses().findIndex(c => c.id === id);
    const deletedCourse = this.courses()[index];
    if (index === -1) {
      return Promise.reject(new Error('Course not found'));
    }
    this.courses.update(courses => courses.filter((_, i) => i !== index));
    this.toast.create({
      position: 'bottom-center',
      content: `"${deletedCourse.name}" dersi başarıyla silindi`,
      type: 'success',
      time: 3
    });
    return Promise.resolve();
  }
} 