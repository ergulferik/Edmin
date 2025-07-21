export interface ClassItem {
 id: string;
 name: string;
 fieldId?: string;
 studentCount: number;
 averageGrade: number;
}

export interface Field {
 id: string;
 name: string;
 order: number;
}

export interface CourseSchedule {
 id: string;
 classId: string;
 courseId: string;
 teacherId: string;
 description: string;
 start: Date;
 end: Date;
}
