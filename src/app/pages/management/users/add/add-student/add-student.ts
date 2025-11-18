import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../../../../components/page/page-header/page-header';
import { HelperService } from '../../../../../services/helper.service';
import { Address, District, Province } from '../../../../../models/general.model';
import { AddressFormComponent } from '../../address-form/address-form';
import { PersonalInfoFormComponent } from '../../personal-info-form/personal-info-form';
import { GuardiansComponent } from '../../guardians/guardians';
import { PaymentPlanComponent } from '../../payment-plan/payment-plan';

/**
 * Add Student component
 * @description Yeni öğrenci ekleme sayfası - Role management sayfası tasarım modeli referans alınarak oluşturulmuştur
 */
@Component({
 selector: 'app-add-student',
 standalone: true,
 imports: [
  CommonModule,
  ReactiveFormsModule,
  MatButtonModule,
  PageHeaderComponent,
  AddressFormComponent,
  PersonalInfoFormComponent,
  GuardiansComponent,
  PaymentPlanComponent,
 ],
 templateUrl: './add-student.html',
 styleUrl: './add-student.scss',
})
export class AddStudent implements OnInit {
 private fb = inject(FormBuilder);
 private router = inject(Router);
 private helperService = inject(HelperService);
 provinces = signal<Province[]>([]);
 districts = signal<District[]>([]);

 // Dropdown state management
 selectedCityName = signal<string>('Şehir seçiniz');
 selectedDistrictName = signal<string>('İlçe seçiniz');

 /**
  * Student form group
  * @description Öğrenci bilgileri için reactive form
  */
 studentForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  surname: ['', [Validators.required, Validators.minLength(2)]],
  gender: [''],
  dateOfBirth: [''],
  photo: [''],
  nationalId: ['', [Validators.pattern(/^\d{11}$/)]],
  phone: ['', [Validators.required, Validators.pattern(/^(\+90|0)?[5][0-9]{9}$/)]],
  email: ['', [Validators.email]],
  address: this.fb.group({
   city: [''],
   district: [''],
   fullAddress: [''],
   postalCode: [''],
  }),
  guardians: this.fb.array([
   this.fb.group({
    relation: ['father', [Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+90|0)?[5][0-9]{9}$/)]],
    email: ['', [Validators.email]],
    address: this.fb.group({
     city: [''],
     district: [''],
     fullAddress: [''],
     postalCode: [''],
    }),
    addressOption: ['same'],
    addressDisplay: [''],
   }),
  ]),
  paymentPlan: this.fb.group({
   totalFee: ['', [Validators.required, Validators.min(0)]],
   paid: [0],
   remaining: [0],
   numberOfInstallments: ['', [Validators.min(0)]],
   downPayment: [0, [Validators.min(0)]],
   note: [''],
   installments: this.fb.array([]),
  }),
 });

 /**
  * Component başlatıldığında
  */
 ngOnInit(): void {
  // Component initialization
  this.helperService.getProvinces().then(provinces => {
   this.provinces.set(provinces);
  });
 }

 /**
  * Şehir seçildiğinde
  */
 onSelectCity(provinceId: number, provinceName: string): void {
  this.studentForm.get('address.city')?.setValue(provinceId);
  this.selectedCityName.set(provinceName);
  this.helperService.getDistricts(provinceId).then(districts => {
   this.districts.set(districts);
   this.studentForm.get('address.district')?.setValue('');
   this.selectedDistrictName.set('İlçe seçiniz');
   this.updateGuardianAddresses();
  });
 }

 /**
  * İlçe seçildiğinde
  */
 onSelectDistrict(districtId: number, districtName: string): void {
  this.studentForm.get('address.district')?.setValue(districtId);
  this.selectedDistrictName.set(districtName);
  this.updateGuardianAddresses();
 }

 /**
  * Form alanının geçersiz olup olmadığını kontrol eder
  * @param fieldName Form alan adı
  * @returns Alan geçersizse true
  */
 isFieldInvalid(fieldName: string): boolean {
  const field = this.studentForm.get(fieldName);
  return !!(field && field.invalid && (field.dirty || field.touched));
 }

 /**
  * Form alanının hata mesajını döndürür
  * @param fieldName Form alan adı
  * @returns Hata mesajı
  */
 getFieldError(fieldName: string): string {
  const field = this.studentForm.get(fieldName);
  if (!field || !field.errors) return '';

  if (field.errors['required']) {
   return `${this.getFieldLabel(fieldName)} zorunludur.`;
  }
  if (field.errors['minlength']) {
   return `${this.getFieldLabel(fieldName)} en az ${field.errors['minlength'].requiredLength} karakter olmalıdır.`;
  }
  if (field.errors['pattern']) {
   if (fieldName === 'nationalId') {
    return 'TC Kimlik No 11 haneli sayı olmalıdır.';
   }
   if (fieldName === 'phone') {
    return 'Geçerli bir telefon numarası giriniz.';
   }
  }
  if (field.errors['email']) {
   return 'Geçerli bir e-posta adresi giriniz.';
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
   name: 'Ad',
   surname: 'Soyad',
   phone: 'Telefon',
   studentNumber: 'Öğrenci Numarası',
   classId: 'Sınıf',
   'guardians.name': 'Veli Adı',
   'guardians.phone': 'Veli Telefonu',
   'guardians.email': 'Veli E-postası',
   'paymentPlan.totalFee': 'Toplam Ücret',
   'paymentPlan.downPayment': 'Peşinat',
   'paymentPlan.numberOfInstallments': 'Taksit Sayısı',
   'paymentPlan.remaining': 'Kalan Tutar',
  };
  return labels[fieldName] || fieldName;
 }

 /**
  * Form gönderildiğinde
  */
 onSubmit(): void {
  if (this.studentForm.valid) {
   console.log('Form değerleri:', this.studentForm.value);
   // TODO: API çağrısı eklenecek
   // Başarılı submit sonrası yönlendirme yapılabilir
   // this.router.navigate(['/students']);
  } else {
   this.touchAbstractControl(this.studentForm);
  }
 }

 /**
  * Form iptal edildiğinde
  */
 onCancel(): void {
  this.router.navigate(['/users']);
 }

 /**
  * Kişisel bilgiler değiştiğinde
  */
 onPersonalInfoChange(value: any): void {
  this.studentForm.patchValue(value);
 }

 /**
  * Marks all controls in the provided form group as touched
  * @param formGroup Hedef form grubu
  */
 private touchAbstractControl(control: AbstractControl): void {
  if (control instanceof FormGroup) {
   Object.values(control.controls).forEach(child => this.touchAbstractControl(child));
  } else if (control instanceof FormArray) {
   control.controls.forEach(child => this.touchAbstractControl(child));
  }
  control.markAsTouched();
 }

 /**
  * Guardians form array getter
  */
 get guardians(): FormArray {
  return this.studentForm.get('guardians') as FormArray;
 }

 /**
  * Installments form array getter
  */
 get installments(): FormArray {
  const paymentPlan = this.studentForm.get('paymentPlan') as FormGroup;
  return paymentPlan?.get('installments') as FormArray;
 }

 /**
  * Kişisel bilgileri döndürür
  */
 getPersonalInfo(): any {
  return {
   name: this.studentForm.get('name')?.value,
   surname: this.studentForm.get('surname')?.value,
   gender: this.studentForm.get('gender')?.value,
   dateOfBirth: this.studentForm.get('dateOfBirth')?.value,
   photo: this.studentForm.get('photo')?.value,
   nationalId: this.studentForm.get('nationalId')?.value,
   phone: this.studentForm.get('phone')?.value,
   email: this.studentForm.get('email')?.value,
  };
 }

 /**
  * Veli ekler
  */
 addGuardian(relation: 'mother' | 'father' | 'other' = 'other'): void {
  const guardianGroup = this.fb.group({
   relation: [relation, [Validators.required]],
   name: ['', [Validators.required]],
   phone: ['', [Validators.required, Validators.pattern(/^(\+90|0)?[5][0-9]{9}$/)]],
   email: ['', [Validators.email]],
   address: this.fb.group({
    city: [''],
    district: [''],
    fullAddress: [''],
    postalCode: [''],
   }),
   addressOption: ['same'],
   addressDisplay: [''],
  });
  this.guardians.push(guardianGroup);
  // Öğrenci adresini kopyala
  const studentAddress = this.studentForm.get('address')?.value;
  guardianGroup.get('address')?.patchValue(studentAddress);
  guardianGroup.get('addressDisplay')?.setValue('Öğrenci ile aynı');
 }

 /**
  * Ödeme planı form group'unu döndürür
  */
 getPaymentPlan(): FormGroup {
  return this.studentForm.get('paymentPlan') as FormGroup;
 }

 /**
  * Öğrenci adresini döndürür
  */
 getStudentAddress(): Address {
  return this.studentForm.get('address')?.value || {};
 }

 /**
  * Adres değiştiğinde
  */
 onAddressChange(address: Address): void {
  this.studentForm.get('address')?.patchValue(address);
  this.updateGuardianAddresses();
 }

 /**
  * Öğrenci adresi değiştiğinde veli adreslerini güncelle
  */
 private updateGuardianAddresses(): void {
  const studentAddress = this.studentForm.get('address')?.value;
  this.guardians.controls.forEach(guardianGroup => {
   const addressOption = (guardianGroup as FormGroup).get('addressOption')?.value;
   if (addressOption === 'same') {
    (guardianGroup as FormGroup).get('address')?.patchValue(studentAddress);
    (guardianGroup as FormGroup).get('addressDisplay')?.setValue('Öğrenci ile aynı');
   }
  });
 }
}
