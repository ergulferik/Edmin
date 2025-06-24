export interface Student {
    id: string;
    name: string;
    surname: string;
    averageGrade: number;
    studentNumber: string;
    classId: string;
}

export interface ClassItem {
    id: string;
    name: string;
    fieldId: string;
    studentCount: number;
    averageGrade: number;
}

export interface Field {
    id: string;
    name: string;
    order: number;
}