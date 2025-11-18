import { Component, Input, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Installments } from '../../../../models/general.model';
import { HelperService } from '../../../../services/helper.service';
import { DynamicModalService } from '../../../../services/dynamic-modal.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { AppButtonComponent } from '../../../../components/button/button';
import { heroBanknotes } from '@ng-icons/heroicons/outline';

/**
 * Payment plan component
 * @description Ödeme planı için form component'i - modal veya düz component olarak kullanılabilir
 */
@Component({
 selector: 'app-payment-plan',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, MatButtonModule, NgIconComponent, AppButtonComponent],
 templateUrl: './payment-plan.html',
 styleUrl: './payment-plan.scss',
 viewProviders: [
  provideIcons({
   heroBanknotes,
  }),
 ],
})
export class PaymentPlanComponent implements OnInit {
 private fb = inject(FormBuilder);
 private helperService = inject(HelperService);
 private dynamicModalService = inject(DynamicModalService);
 paymentDays = new Date().getDate();
 onValueChange = output<FormGroup>();

 @Input() paymentPlan: FormGroup = this.fb.group({
  totalFee: ['', [Validators.required, Validators.min(0)]],
  paid: [0],
  remaining: [0],
  numberOfInstallments: ['', [Validators.min(0)]],
  downPayment: [0, [Validators.min(0)]],
  note: [''],
  installments: this.fb.array([]),
 });

 ngOnInit(): void {
  const modal = this.dynamicModalService.modalData;
  if (modal) {
   // Modal içindeyse modal'dan gelen veriyi kullan
   this.paymentPlan.patchValue(modal);
   if (modal.installments && Array.isArray(modal.installments)) {
    while (this.installments.length !== 0) {
     this.installments.removeAt(0);
    }
    modal.installments.forEach((inst: Installments) => {
     this.installments.push(
      this.fb.group({
       id: [inst.id || this.helperService.generateRandomId()],
       amount: [inst.amount],
       dueDate: [inst.dueDate, [Validators.required]],
       isPaid: [inst.isPaid || false],
       paidAt: [inst.paidAt || ''],
       note: [inst.note || ''],
      })
     );
    });
   }
  }

  // Değişiklikleri emit et
  this.paymentPlan.valueChanges.subscribe(_ => {
   this.onValueChange.emit(this.paymentPlan);
  });

  // Modal içindeyse değişiklikleri modal servisine kaydet
  if (modal) {
   this.paymentPlan.valueChanges.subscribe(_ => {
    this.dynamicModalService.modalData = this.paymentPlan.value;
   });
  }
 }

 /**
  * Installments form array getter
  */
 get installments(): FormArray {
  return this.paymentPlan?.get('installments') as FormArray;
 }

 /**
  * Taksit sayısı değiştiğinde
  */
 onChangeNumberOfInstallments(event: Event): void {
  const numberOfInstallments = Number((event.target as HTMLInputElement).value);
  if (numberOfInstallments < 0) return;

  this.paymentPlan?.get('numberOfInstallments')?.setValue(numberOfInstallments);

  // Mevcut taksitleri temizle
  while (this.installments.length !== 0) {
   this.installments.removeAt(0);
  }

  if (numberOfInstallments > 0) {
   const remaining = Number(this.paymentPlan?.get('remaining')?.value) || 0;
   const installmentAmount = remaining > 0 ? remaining / numberOfInstallments : 0;

   // Yeni taksitleri ekle
   for (let i = 0; i < numberOfInstallments; i++) {
    const dueDate = this.addMonthsKeepingDay(new Date(), i + 1)
     .toISOString()
     .substring(0, 10);
    this.installments.push(
     this.fb.group({
      id: [this.helperService.generateRandomId()],
      amount: [Math.round(installmentAmount * 100) / 100], // 2 ondalık basamak
      dueDate: [dueDate, [Validators.required]],
      isPaid: [false],
      paidAt: [''],
      note: [''],
     })
    );
   }
  }
 }

 /**
  * Kalan tutarı günceller
  */
 updateRemaining(): void {
  if (!this.paymentPlan) return;

  const totalFee = Number(this.paymentPlan.get('totalFee')?.value) || 0;
  const downPayment = Number(this.paymentPlan.get('downPayment')?.value) || 0;
  const paid = Number(this.paymentPlan.get('paid')?.value) || 0;
  const remaining = Math.max(totalFee - downPayment - paid, 0);

  this.paymentPlan.get('remaining')?.setValue(remaining, { emitEvent: false });

  // Taksit sayısı varsa taksit tutarlarını yeniden hesapla
  const numberOfInstallments = Number(this.paymentPlan.get('numberOfInstallments')?.value) || 0;
  if (numberOfInstallments > 0 && this.installments.length > 0) {
   const installmentAmount = remaining > 0 ? remaining / numberOfInstallments : 0;
   this.installments.controls.forEach(control => {
    control.get('amount')?.setValue(Math.round(installmentAmount * 100) / 100);
   });
  }
 }

 /**
  * Taksit ödemesi yapıldığında
  */
 payment(installmentIndex: number): void {
  const installmentGroup = this.installments.at(installmentIndex) as FormGroup;
  if (!installmentGroup || installmentGroup.get('isPaid')?.value) return;

  const amount = Number(installmentGroup.get('amount')?.value) || 0;

  // Taksiti ödendi olarak işaretle
  installmentGroup.patchValue({
   isPaid: true,
   paidAt: new Date().toISOString().substring(0, 10),
  });

  // Ödenen tutarı güncelle
  const currentPaid = Number(this.paymentPlan.get('paid')?.value) || 0;
  this.paymentPlan.get('paid')?.setValue(currentPaid + amount);
  this.updateRemaining();
 }

 /**
  * Ay eklerken günü paymentDays'e göre sabit tutar
  */
 private addMonthsKeepingDay(date: Date, months: number): Date {
  const d = new Date(date);

  // Yeni ayı hesapla
  const targetMonth = d.getMonth() + months;
  d.setMonth(targetMonth, 1); // Ayın ilk gününe git (taşma engellenir)

  // Ayın paymentDays gününü ayarla
  const desiredDay = this.paymentDays;

  // Eğer ay, istenen günü desteklemiyorsa (ör: Şubat 31)
  // ayın son gününü ayarla
  const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(desiredDay, lastDayOfMonth));

  return d;
 }

 /**
  * Form alanının geçersiz olup olmadığını kontrol eder
  * @param fieldName Form alan adı
  * @returns Alan geçersizse true
  */
 isFieldInvalid(fieldName: string): boolean {
  const field = this.paymentPlan.get(fieldName);
  return !!(field && field.invalid && (field.dirty || field.touched));
 }

 /**
  * Form alanının hata mesajını döndürür
  * @param fieldName Form alan adı
  * @returns Hata mesajı
  */
 getFieldError(fieldName: string): string {
  const field = this.paymentPlan.get(fieldName);
  if (!field || !field.errors) return '';

  if (field.errors['required']) {
   return `${this.getFieldLabel(fieldName)} zorunludur.`;
  }
  if (field.errors['min']) {
   return `${this.getFieldLabel(fieldName)} en az ${field.errors['min'].min} olmalıdır.`;
  }

  return 'Geçersiz değer.';
 }

 /**
  * Form alanının etiketini döndürür
  * @param fieldName Form alan adı
  * @returns Alan etiketi
  */
 private getFieldLabel(fieldName: string): string {
  const labels: { [key: string]: string } = {
   totalFee: 'Toplam Ücret',
   downPayment: 'Peşinat',
   numberOfInstallments: 'Taksit Sayısı',
   remaining: 'Kalan Tutar',
  };
  return labels[fieldName] || fieldName;
 }

 onChangePaymentDays(event: Event): void {
  const paymentDays = Number((event.target as HTMLInputElement).value);
  if (paymentDays < 1 || paymentDays > 31) return;

  this.paymentDays = paymentDays;

  // Sadece ödenmemiş taksitlerin bitiş tarihi güncellenecek
  this.installments.controls.forEach((installment, index) => {
   const isPaid = installment.get('isPaid')?.value;

   if (isPaid) return; // Ödenenler değişmesin

   const newDueDate = this.addMonthsKeepingDay(new Date(), index + 1)
    .toISOString()
    .substring(0, 10);

   installment.get('dueDate')?.setValue(newDueDate);
  });
 }
}
