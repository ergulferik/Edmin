export interface Teacher {
 id: string;
 name: string;
 surname: string;
 gender: 'male' | 'female';
 password: string;
 email: string;
 phone: string;
 address: string;
 image: string;
 courses: string[];
 classes: string[];
 isActive: boolean;
 workStart: Date;
 workEnd?: Date;
}
