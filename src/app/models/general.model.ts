export interface Address {
 city?: string;
 district?: string;
 fullAddress?: string;
 postalCode?: string;
}
export interface Province {
 id: number;
 name: string;
 area: number;
 areaCode: number[];
}
export interface District {
 provinceId: number;
 id: number;
 province: string;
 name: string;
 area: number;
}

export interface Image {
 mimeType: string;
 url: string;
 path: string;
}

export interface Installments {
 id: string;
 amount: number;
 dueDate: Date | string;
 paidAt?: string;
 isPaid: boolean;
 note?: string;
}

export interface PaymentPlan {
 totalFee: number;
 paid: number;
 remaining: number;
 numberOfInstallments: number;
 downPayment: number;
 note?: string;
 installments?: Array<Installments>;
}
