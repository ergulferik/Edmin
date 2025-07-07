import { ClassItem, Field } from '../models/class.model';
import { Course } from '../models/course.model';

export const COURSES_DATA: Course[] = [
  { id: '1', name: 'Matematik' },
  { id: '2', name: 'Fizik' },
  { id: '3', name: 'Kimya' },
  { id: '4', name: 'Biyoloji' },
  { id: '5', name: 'Tarih' },
  { id: '6', name: 'Coğrafya' },
  { id: '7', name: 'Türkçe' },
  { id: '8', name: 'İngilizce' },
  { id: '9', name: 'Din' }
];

export const FIELDS_DATA: Field[] = [
  { id: 'all', name: 'All', order: 0 },
  { id: '1', name: 'Numerical', order: 1 },
  { id: '2', name: 'Verbal', order: 2 },
  { id: '3', name: 'Equal Weight', order: 3 }
];

export const CLASSES_DATA: ClassItem[] = [
  { id: '1', name: '9-A', fieldId: '1', studentCount: 25, averageGrade: 85.2 },
  { id: '2', name: '9-B', fieldId: '2', studentCount: 28, averageGrade: 82.1 },
  { id: '3', name: '10-A', fieldId: '1', studentCount: 22, averageGrade: 87.5 },
  { id: '4', name: '10-B', fieldId: '2', studentCount: 30, averageGrade: 80.3 },
  { id: '5', name: '11-A', fieldId: '1', studentCount: 24, averageGrade: 89.1 },
  { id: '6', name: '11-B', fieldId: '3', studentCount: 26, averageGrade: 83.7 },
  { id: '7', name: '12-A', fieldId: '1', studentCount: 20, averageGrade: 91.2 },
  { id: '8', name: '12-B', fieldId: '3', studentCount: 27, averageGrade: 86.4 }
];
