import { Address, PaymentPlan } from './general.model';

export interface Student {
 id: string;
 name: string;
 surname: string;
 gender?: 'male' | 'female' | 'other';
 dateOfBirth?: Date;
 photo?: string;
 nationalId?: string;
 phone: string;
 email?: string;
 address?: Address;
 guardian?: Array<Guardian>;
 grade?: string; // 11, 12, mezun, TYT sınıfı vs.
 studentNumber: string;
 classId: string;
 paymentPlan?: PaymentPlan;
 recordStatus?: 'active' | 'deleted';
}

export interface Guardian {
 name: string;
 relation: 'mother' | 'father' | 'other';
 phone: string;
 email?: string;
 address?: Address;
}
