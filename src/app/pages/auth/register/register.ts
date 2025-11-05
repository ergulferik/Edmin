import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/auth.service';
import { DcToastService } from 'dc-toast-ng';

/**
 * Register sayfası component'i
 * @description Kullanıcıların yeni hesap oluşturmasını sağlar
 */
@Component({
 selector: 'app-register',
 standalone: true,
 imports: [
  CommonModule,
  ReactiveFormsModule,
  RouterLink,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
 ],
 templateUrl: './register.html',
 styleUrl: './register.scss',
})
export class RegisterPage {
 /** Form builder instance */
 private fb = inject(FormBuilder);
 /** Router instance */
 private router = inject(Router);
 /** Auth service instance */
 private authService = inject(AuthService);

 /** Toastr service instance */
 toast = inject(DcToastService);
 /** Register form group */
 registerForm: FormGroup;

 /** Şifre görünürlüğü kontrolü */
 hidePassword = true;
 /** Şifre tekrar görünürlüğü kontrolü */
 hideConfirmPassword = true;

 /**
  * Register sayfası constructor
  * Register formunu oluşturur
  */
 constructor() {
  this.registerForm = this.fb.group(
   {
    name: ['', [Validators.required, Validators.minLength(2)]],
    surname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
   },
   {
    validators: this.passwordMatchValidator,
   }
  );
 }

 /**
  * Şifre eşleşme validatörü
  * @param formGroup Form group
  * @returns Validation errors veya null
  */
 passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmPassword');

  if (!password || !confirmPassword) {
   return null;
  }

  if (password.value !== confirmPassword.value) {
   confirmPassword.setErrors({ passwordMismatch: true });
   return { passwordMismatch: true };
  } else {
   confirmPassword.setErrors(null);
   return null;
  }
 }

 /**
  * Şifre görünürlüğünü toggle eder
  */
 togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
 }

 /**
  * Şifre tekrar görünürlüğünü toggle eder
  */
 toggleConfirmPasswordVisibility(): void {
  this.hideConfirmPassword = !this.hideConfirmPassword;
 }

 /**
  * Form submit işlemi
  * Register formunu işler ve kullanıcıyı yönlendirir
  */
 onSubmit(): void {
  if (this.registerForm.valid) {
   const { name, surname, email, password } = this.registerForm.value;
   this.authService
    .register(name, surname, email, password)
    .then(() => {
     this.router.navigate(['/class-operations']);
    })
    .catch(error => {
     this.toast.create({
      position: 'bottom-center',
      content: error.error.message,
      type: 'error',
      time: 3,
     });
    });
  } else {
   this.registerForm.markAllAsTouched();
  }
 }

 /**
  * Name form control getter
  */
 get nameControl() {
  return this.registerForm.get('name');
 }

 /**
  * Surname form control getter
  */
 get surnameControl() {
  return this.registerForm.get('surname');
 }

 /**
  * Email form control getter
  */
 get emailControl() {
  return this.registerForm.get('email');
 }

 /**
  * Password form control getter
  */
 get passwordControl() {
  return this.registerForm.get('password');
 }

 /**
  * Confirm password form control getter
  */
 get confirmPasswordControl() {
  return this.registerForm.get('confirmPassword');
 }
}
