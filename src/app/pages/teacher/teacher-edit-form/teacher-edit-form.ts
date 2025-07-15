import { Component, inject, signal, effect, viewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { MatMenuModule } from '@angular/material/menu';
import { ClassItem, Field } from '../../../models/class.model';
import { ClassService } from '../../../services/class.service';
import { Course } from '../../../models/course.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TeacherService } from '../../../services/teacher.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Avatar } from '../../../components/avatar/avatar';
import { ModalHeader } from '../../../components/modal/modal-header/modal-header';
import {
  ModalFooter,
  ModalFooterButton,
} from '../../../components/modal/modal-footer/modal-footer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

/**
 * Öğretmen düzenleme formu bileşeni
 * Kişisel ve kurum bilgilerini adım adım toplar
 */
@Component({
  selector: 'app-teacher-edit-form',
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatIconModule,
    NgIconComponent,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    Avatar,
    ModalHeader,
    ModalFooter,
  ],
  standalone: true,
  templateUrl: './teacher-edit-form.html',
  styleUrl: './teacher-edit-form.scss',
  providers: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
    }),
  ],
})
export class TeacherEditForm {
  formBuilder = inject(FormBuilder);
  classService = inject(ClassService);
  teacherService = inject(TeacherService);
  dialogRef = inject(MatDialogRef);

  stepper = viewChild<MatStepper>(MatStepper);

  MAX_STEP_INDEX = 1;

  footerButtons = signal<ModalFooterButton[]>([
    {
      title: 'İleri',
      disabled: false,
      onClick: () => this.stepper()?.next(),
      visible: true,
      type: 'submit',
    },
    {
      title: 'Geri',
      onClick: () => {
        this.stepper()?.previous();
      },
      visible: false,
      type: 'cancel',
    },
    {
      title: 'Kaydet',
      disabled: !this.canSave,
      onClick: () => this.onSave(),
      visible: true,
      type: 'submit',
    },
    {
      title: 'İptal',
      onClick: () => this.onCancel(),
      visible: true,
      type: 'cancel',
    },
  ]);

  /**
   * Branş(Alan) seçenekleri
   */
  coursesOptions = signal<Course[]>([]);

  /**
   * Sınıf seçenekleri
   */
  classesOptions = signal<ClassItem[]>([]);

  fieldsOptions = signal<Field[]>([]);

  /**
   * Kişisel Bilgiler Formu
   * Sıralama: Adı, Soyadı, Cinsiyet, Telefon, Email, Adres, Fotoğraf
   */
  personalInfoForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    gender: new FormControl(''),
    phone: new FormControl('+90', [Validators.required, Validators.pattern(/^\+90\d{10}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    image: new FormControl(''),
  });

  /**
   * Kurum Bilgileri Formu
   * Sıralama: Şifre, Branş(Alan), Sınıflar, Aktiflik, İşe Başlama, İşten Ayrılma
   */
  schoolInfoForm = this.formBuilder.group({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    courses: new FormControl<string[]>([], [Validators.required]),
    classes: new FormControl<string[]>([], [Validators.required]),
    isActive: new FormControl(true, [Validators.required]),
    workStart: new FormControl<Date | null>(null, [Validators.required]),
    workEnd: new FormControl<Date | null>(null),
  });

  stepperForms: FormGroup[] = [this.personalInfoForm, this.schoolInfoForm];

  get canSave(): boolean {
    if (!this.stepperForms || this.stepperForms.length === 0) return false;
    return this.stepperForms.every(form => form.valid);
  }

  // Şifre göster/gizle için değişken
  showPassword = false;

  /**
   * Şifre alanının görünürlüğünü değiştirir
   */
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Telefon inputunda sadece rakam girilmesini ve +90 ile başlamasını sağlar
   */
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value.startsWith('+90')) {
      input.value = '+90' + input.value.replace(/[^0-9]/g, '').substring(0, 10);
    } else {
      const digits = input.value
        .substring(3)
        .replace(/[^0-9]/g, '')
        .substring(0, 10);
      input.value = '+90' + digits;
    }
    this.personalInfoForm.get('phone')?.setValue(input.value, {
      emitEvent: false,
    });
  }

  constructor() {
    effect(() => {
      this.coursesOptions.set(this.classService.courses());
      this.classesOptions.set(this.classService.classes());
      this.fieldsOptions.set(this.classService.fields());
      const selected = this.teacherService.selectedTeacher();
      if (selected) {
        this.personalInfoForm.patchValue(selected);
        this.schoolInfoForm.patchValue({
          ...selected,
          courses: Array.isArray(selected.courses) ? selected.courses : [],
          classes: Array.isArray(selected.classes) ? selected.classes : [],
        });
      }
    });

    this.stepperForms.forEach(form => {
      form.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        this.footerButtons.update(buttons => {
          const newButtons = [...buttons];
          newButtons[2].disabled = !this.canSave;
          return newButtons;
        });
      });
    });
  }

  /**
   * FormGroup içindeki ilk hatalı alanın hata mesajını döndürür
   * @param form FormGroup
   */
  getFirstError(form: FormGroup): string {
    if (form.untouched) return '';
    for (const key of Object.keys(form.controls)) {
      const control = form.get(key);
      if (control && control.invalid) {
        if (control.hasError('required')) {
          switch (key) {
            case 'name':
              return 'Adı zorunludur';
            case 'surname':
              return 'Soyadı zorunludur';
            case 'phone':
              return 'Telefon zorunludur';
            case 'email':
              return 'Email zorunludur';
            case 'address':
              return 'Adres zorunludur';
            case 'password':
              return 'Şifre zorunludur';
            case 'courses':
              return 'Dersler zorunludur';
            case 'classes':
              return 'Sınıf bilgisi zorunludur';
            case 'isActive':
              return 'Aktiflik bilgisi zorunludur';
            case 'workStart':
              return 'Başlama tarihi zorunludur';
          }
        }
        if (control.hasError('minlength')) {
          if (key === 'password') return 'Şifre en az 6 karakter olmalı';
          if (key === 'address') return 'Adres en az 5 karakter olmalı';
        }
        if (control.hasError('email')) {
          return 'Geçerli bir email giriniz';
        }
        if (control.hasError('pattern') && key === 'phone') {
          return 'Telefon +90 ile başlamalı ve 10 haneli olmalı';
        }
      }
    }
    return '';
  }

  /**
   * FormGroup içindeki tüm alanları touched yapar
   * @param formGroup FormGroup
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Fotoğrafı düzenle butonuna tıklandığında file picker'ı açar
   */
  onEditPhoto(input: HTMLInputElement): void {
    input.click();
  }

  /**
   * Fotoğraf seçildiğinde çağrılır. Sadece jpg ve png kabul eder.
   * @param event File input change event
   */
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: 'Hata',
        text: 'Sadece JPG veya PNG formatında fotoğraf seçebilirsiniz.',
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.personalInfoForm.patchValue({
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  /**
   * Fotoğrafı siler
   */
  onDeletePhoto(): void {
    this.personalInfoForm.patchValue({
      image: null,
    });
  }

  /**
   * Stepper adımı değiştiğinde ilgili formu touched yapar
   * @param index Yeni adımın index'i
   */
  onStepperIndexChange(previousIndex: number, index: number) {
    this.stepperForms[previousIndex].markAsTouched();

    if (index == 0) {
      this.footerButtons.update(buttons => {
        const newButtons = [...buttons];
        newButtons[0].visible = true;
        newButtons[1].visible = false;
        newButtons[2].visible = true;
        newButtons[3].visible = true;
        return newButtons;
      });
    } else if (index === this.MAX_STEP_INDEX) {
      this.footerButtons.update(buttons => {
        const newButtons = [...buttons];
        newButtons[0].visible = false;
        newButtons[1].visible = true;
        newButtons[2].visible = true;
        newButtons[3].visible = true;
        return newButtons;
      });
    } else {
      this.footerButtons.update(buttons => {
        const newButtons = [...buttons];
        newButtons[0].visible = true;
        newButtons[1].visible = true;
        newButtons[2].visible = true;
        newButtons[3].visible = true;
        return newButtons;
      });
    }
  }

  getFieldNameById(id?: string) {
    return id ? ` - (${this.fieldsOptions().find(field => field.id === id)?.name})` : '';
  }

  /**
   * Ad ve soyadın ilk harflerinden oluşan avatar metni döndürür
   * @returns {string} Baş harfler
   */
  getInitials(): string {
    const name = this.personalInfoForm.get('name')?.value || '';
    const surname = this.personalInfoForm.get('surname')?.value || '';
    return (name.charAt(0) + surname.charAt(0)).toUpperCase();
  }

  onSave() {
    this.markFormGroupTouched(this.schoolInfoForm);
    this.markFormGroupTouched(this.personalInfoForm);
    if (this.schoolInfoForm.invalid || this.personalInfoForm.invalid) return;

    this.dialogRef.close({
      ...this.schoolInfoForm.value,
      ...this.personalInfoForm.value,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
