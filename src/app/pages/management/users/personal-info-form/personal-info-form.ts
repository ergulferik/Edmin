import { Component, Input, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FilePickerComponent } from '../../../../components/file-picker/file-picker';
import { DynamicModalService } from '../../../../services/dynamic-modal.service';

/**
 * Personal info form component
 * @description Öğrenci kişisel bilgileri için form component'i - modal veya düz component olarak kullanılabilir
 */
@Component({
 selector: 'app-personal-info-form',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, MatButtonModule, FilePickerComponent],
 templateUrl: './personal-info-form.html',
 styleUrl: './personal-info-form.scss',
})
export class PersonalInfoFormComponent implements OnInit {
 private fb = inject(FormBuilder);
 private dynamicModalService = inject(DynamicModalService);
 onValueChange = output<any>();

 @Input() personalInfo: {
  name?: string;
  surname?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
 } = {};

 /**
  * Personal info form group
  */
 personalInfoForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  surname: ['', [Validators.required, Validators.minLength(2)]],
  gender: [''],
  dateOfBirth: [''],
  photo: [''],
  nationalId: ['', [Validators.pattern(/^\d{11}$/)]],
  phone: ['', [Validators.required, Validators.pattern(/^(\+90|0)?[5][0-9]{9}$/)]],
  email: ['', [Validators.email]],
 });

 selectedGender = signal<string>('Cinsiyet seçiniz');

 ngOnInit(): void {
  const modal = this.dynamicModalService.modalData;
  const initialData = modal || this.personalInfo;

  if (initialData) {
   this.personalInfoForm.patchValue(initialData);
   if (initialData.gender) {
    this.onSelectGender(initialData.gender);
   }
  }

  // Modal içindeyse değişiklikleri modal servisine kaydet
  if (modal) {
   this.personalInfoForm.valueChanges.subscribe(_ => {
    this.dynamicModalService.modalData = this.personalInfoForm.value;
   });
  } else {
   // Düz component olarak kullanılıyorsa output ile emit et
   this.personalInfoForm.valueChanges.subscribe(value => {
    this.onValueChange.emit(value);
   });
   // İlk değeri de emit et
   this.onValueChange.emit(this.personalInfoForm.value);
  }
 }

 /**
  * Cinsiyet seçildiğinde
  * @param gender Seçilen cinsiyet
  */
 onSelectGender(gender: string): void {
  this.personalInfoForm.get('gender')?.setValue(gender);
  if (gender === 'male') {
   this.selectedGender.set('Erkek');
  } else if (gender === 'female') {
   this.selectedGender.set('Kadın');
  } else if (gender === 'other') {
   this.selectedGender.set('Diğer');
  } else {
   this.selectedGender.set('Cinsiyet seçiniz');
  }
 }

 /**
  * Dosya seçildiğinde
  */
 onSelectFile(file: File | null): void {
  const reader = new FileReader();
  reader.onload = () => {
   this.personalInfoForm.get('photo')?.setValue(reader.result); // base64 Data URL
  };
  reader.readAsDataURL(file || new Blob());
 }

 /**
  * Fotoğraf değiştirildiğinde
  */
 onChangePhoto(): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event: Event) => {
   this.onSelectFile((event.target as HTMLInputElement).files?.[0] || null);
  };
  input.click();
 }

 /**
  * Form alanının geçersiz olup olmadığını kontrol eder
  * @param fieldName Form alan adı
  * @returns Alan geçersizse true
  */
 isFieldInvalid(fieldName: string): boolean {
  const field = this.personalInfoForm.get(fieldName);
  return !!(field && field.invalid && (field.dirty || field.touched));
 }

 /**
  * Form alanının hata mesajını döndürür
  * @param fieldName Form alan adı
  * @returns Hata mesajı
  */
 getFieldError(fieldName: string): string {
  const field = this.personalInfoForm.get(fieldName);
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
  };
  return labels[fieldName] || fieldName;
 }
}
