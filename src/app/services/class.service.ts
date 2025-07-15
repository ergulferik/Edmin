import { inject, Injectable, signal } from '@angular/core';
import { Student } from '../models/student.model';
import { ClassItem, Field } from '../models/class.model';
import { CLASSES_DATA, FIELDS_DATA, COURSES_DATA } from '../data/class.data';
import { STUDENTS_DATA } from '../data/student.data';
import { Course } from '../models/course.model';
import { DcToastService } from 'dc-toast-ng';

/**
 * Class service for managing classes, CRUD operations
 */
@Injectable({
 providedIn: 'root',
})
export class ClassService {
 // In-memory data storage (will be replaced with API calls)

 classes = signal<ClassItem[]>([...CLASSES_DATA]);
 fields = signal<Field[]>([...FIELDS_DATA]);
 courses = signal<Course[]>([...COURSES_DATA]);
 students = signal<Student[]>([...STUDENTS_DATA]);
 private toast = inject(DcToastService);

 draggedStudent = signal<Student | null>(null);

 addClass(classItem: ClassItem): Promise<ClassItem> {
  this.classes.update(classes => [...classes, classItem]);
  return Promise.resolve(classItem);
 }

 addField(field: Field): Promise<Field> {
  this.fields.update(fields => [...fields, field]);
  return Promise.resolve(field);
 }

 // Course CRUD Operations
 getCourses(): Promise<Course[]> {
  // TODO: Replace with API call: return this.http.get<Course[]>('/api/courses')
  return Promise.resolve(this.courses());
 }

 getCourseById(id: string): Promise<Course | undefined> {
  // TODO: Replace with API call: return this.http.get<Course>(`/api/courses/${id}`)
  const course = this.courses().find(c => c.id === id);
  return Promise.resolve(course);
 }

 createCourse(course: Omit<Course, 'id'>): Promise<Course> {
  // TODO: Replace with API call: return this.http.post<Course>('/api/courses', course)
  const newCourse: Course = {
   ...course,
   id: Math.random().toString(36).substring(2),
  };
  this.courses.update(courses => [...courses, newCourse]);
  return Promise.resolve(newCourse);
 }

 updateCourse(id: string, course: Partial<Course>): Promise<Course> {
  // TODO: Replace with API call: return this.http.put<Course>(`/api/courses/${id}`, course)
  const index = this.courses().findIndex(c => c.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Course not found'));
  }
  this.courses.update(courses =>
   courses.map((c, i) =>
    i === index
     ? {
        ...c,
        ...course,
       }
     : c
   )
  );
  return Promise.resolve(this.courses()[index]);
 }

 deleteCourse(id: string): Promise<void> {
  // TODO: Replace with API call: return this.http.delete<void>(`/api/courses/${id}`)
  const index = this.courses().findIndex(c => c.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Course not found'));
  }
  this.courses.update(courses => courses.filter((_, i) => i !== index));
  return Promise.resolve();
 }

 // Class CRUD Operations
 getClasses(): Promise<ClassItem[]> {
  // TODO: Replace with API call: return this.http.get<ClassItem[]>('/api/classes')
  return Promise.resolve(this.classes());
 }

 getClassById(id: string): Promise<ClassItem | undefined> {
  // TODO: Replace with API call: return this.http.get<ClassItem>(`/api/classes/${id}`)
  const classItem = this.classes().find(c => c.id === id);
  return Promise.resolve(classItem);
 }

 createClass(classItem: Omit<ClassItem, 'id'>): Promise<ClassItem> {
  // TODO: Replace with API call: return this.http.post<ClassItem>('/api/classes', classItem)
  const newClass: ClassItem = {
   ...classItem,
   id: Math.random().toString(36).substring(2),
   averageGrade: classItem.averageGrade ?? 0,
   studentCount: classItem.studentCount ?? 0,
  };
  this.classes.update(classes => [...classes, newClass]);
  this.toast.create({
   position: 'bottom-center',
   content: `Sınıf "${classItem.name}" başarıyla oluşturuldu`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(newClass);
 }

 updateClass(id: string, classItem: Partial<ClassItem>): Promise<ClassItem> {
  // TODO: Replace with API call: return this.http.put<ClassItem>(`/api/classes/${id}`, classItem)
  const index = this.classes().findIndex(c => c.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Class not found'));
  }
  this.classes.update(classes =>
   classes.map((c, i) =>
    i === index
     ? {
        ...c,
        ...classItem,
       }
     : c
   )
  );
  this.toast.create({
   position: 'bottom-center',
   content: `Sınıf "${classItem.name}" başarıyla güncellendi`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(this.classes()[index]);
 }

 deleteClass(id: string): Promise<void> {
  // TODO: Replace with API call: return this.http.delete<void>(`/api/classes/${id}`)
  const index = this.classes().findIndex(c => c.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Class not found'));
  }
  const foundClass = this.classes()[index];
  this.classes.update(classes => classes.filter((_, i) => i !== index));
  this.toast.create({
   position: 'bottom-center',
   content: `Sınıf "${foundClass.name}" başarıyla silindi`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve();
 }

 // Field CRUD Operations
 getFields(): Promise<Field[]> {
  // TODO: Replace with API call: return this.http.get<Field[]>('/api/fields')
  return Promise.resolve(this.fields());
 }

 getFieldById(id: string): Promise<Field | undefined> {
  // TODO: Replace with API call: return this.http.get<Field>(`/api/fields/${id}`)
  const field = this.fields().find(f => f.id === id);
  return Promise.resolve(field);
 }

 createField(field: Omit<Field, 'id'>): Promise<Field> {
  // TODO: Replace with API call: return this.http.post<Field>('/api/fields', field)
  const newField: Field = {
   ...field,
   id: Math.random().toString(36).substring(2),
  };
  this.fields.update(fields => [...fields, newField]);
  this.toast.create({
   position: 'bottom-center',
   content: `Alan "${field.name}" başarıyla oluşturuldu`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(newField);
 }

 updateField(id: string, field: Partial<Field>): Promise<Field> {
  // TODO: Replace with API call: return this.http.put<Field>(`/api/fields/${id}`, field)
  const index = this.fields().findIndex(f => f.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Field not found'));
  }
  this.fields.update(fields =>
   fields.map((f, i) =>
    i === index
     ? {
        ...f,
        ...field,
       }
     : f
   )
  );
  this.toast.create({
   position: 'bottom-center',
   content: `Alan "${field.name}" başarıyla güncellendi`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(this.fields()[index]);
 }

 deleteField(id: string): Promise<void> {
  // TODO: Replace with API call: return this.http.delete<void>(`/api/fields/${id}`)
  const index = this.fields().findIndex(f => f.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Field not found'));
  }
  this.fields.update(fields => fields.filter((_, i) => i !== index));
  this.toast.create({
   position: 'bottom-center',
   content: `Alan "${this.fields()[index].name}" başarıyla silindi`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve();
 }

 // Student CRUD Operations
 getStudents(): Promise<Student[]> {
  // TODO: Replace with API call: return this.http.get<Student[]>('/api/students')
  return Promise.resolve(this.students());
 }

 getStudentById(id: string): Promise<Student | undefined> {
  // TODO: Replace with API call: return this.http.get<Student>(`/api/students/${id}`)
  const student = this.students().find(s => s.id === id);
  return Promise.resolve(student);
 }

 getStudentsByClassId(classId: string): Promise<Student[]> {
  // TODO: Replace with API call: return this.http.get<Student[]>(`/api/students?classId=${classId}`)
  const students = this.students().filter(s => s.classId === classId);
  return Promise.resolve(students);
 }

 createStudent(student: Omit<Student, 'id'>): Promise<Student> {
  // TODO: Replace with API call: return this.http.post<Student>('/api/students', student)
  const newStudent: Student = {
   ...student,
   id: Math.random().toString(36).substring(2),
  };
  this.students.update(students => [...students, newStudent]);
  this.toast.create({
   position: 'bottom-center',
   content: `Öğrenci "${student.name}" başarıyla oluşturuldu`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(newStudent);
 }

 updateStudent(id: string, student: Partial<Student>): Promise<Student> {
  // TODO: Replace with API call: return this.http.put<Student>(`/api/students/${id}`, student)
  const index = this.students().findIndex(s => s.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Student not found'));
  }
  this.students.update(students =>
   students.map((s, i) =>
    i === index
     ? {
        ...s,
        ...student,
       }
     : s
   )
  );
  this.toast.create({
   position: 'bottom-center',
   content: `Öğrenci "${this.students()[index].name}" başarıyla güncellendi`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(this.students()[index]);
 }

 deleteStudent(id: string): Promise<void> {
  // TODO: Replace with API call: return this.http.delete<void>(`/api/students/${id}`)
  const index = this.students().findIndex(s => s.id === id);
  if (index === -1) {
   return Promise.reject(new Error('Student not found'));
  }
  this.students.update(students => students.filter((_, i) => i !== index));
  this.toast.create({
   position: 'bottom-center',
   content: `Öğrenci "${this.students()[index].name}" başarıyla silindi`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve();
 }

 // Utility methods
 moveStudentToClass(studentId: string, classId: string): Promise<Student> {
  // TODO: Replace with API call: return this.http.patch<Student>(`/api/students/${studentId}/class`, { classId })
  const student = this.students().find(s => s.id === studentId);
  if (!student) {
   return Promise.reject(new Error('Student not found'));
  }
  const updatedStudent = {
   ...student,
   classId,
  };
  const index = this.students().findIndex(s => s.id === studentId);
  this.students.update(students => students.map((s, i) => (i === index ? updatedStudent : s)));
  this.toast.create({
   position: 'bottom-center',
   content: `Öğrenci "${this.students()[index].name}" başarıyla sınıfa taşındı`,
   type: 'success',
   time: 3,
  });
  return Promise.resolve(updatedStudent);
 }

 calculateClassStatistics(classId: string): Promise<any> {
  // TODO: Replace with API call: return this.http.get<any>(`/api/classes/${classId}/statistics`)
  const classStudents = this.students().filter(s => s.classId === classId);
  const averageGrade = classStudents.reduce((sum, s) => sum + s.averageGrade, 0) / classStudents.length;
  return Promise.resolve({
   studentCount: classStudents.length,
   averageGrade: Math.round(averageGrade * 100) / 100,
  });
 }
}
