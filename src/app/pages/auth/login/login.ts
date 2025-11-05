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
 * Login sayfası component'i
 * @description Kullanıcıların email ve şifre ile giriş yapmasını sağlar
 */
@Component({
 selector: 'app-login',
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
 templateUrl: './login.html',
 styleUrl: './login.scss',
})
export class LoginPage {
 /** Form builder instance */
 private fb = inject(FormBuilder);
 /** Router instance */
 private router = inject(Router);

 private authService = inject(AuthService);

 private toast = inject(DcToastService);

 /** Login form group */
 loginForm: FormGroup;

 /** Şifre görünürlüğü kontrolü */
 hidePassword = true;

 /**
  * Login sayfası constructor
  * Login formunu oluşturur
  */
 constructor() {
  this.loginForm = this.fb.group({
   email: ['', [Validators.required, Validators.email]],
   password: ['', [Validators.required, Validators.minLength(6)]],
  });
 }

 /**
  * Şifre görünürlüğünü toggle eder
  */
 togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
 }

 /**
  * Form submit işlemi
  * Login formunu işler ve kullanıcıyı yönlendirir
  */
 onSubmit(): void {
  if (this.loginForm.valid) {
   this.authService
    .login(this.loginForm.value)
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
   this.loginForm.markAllAsTouched();
  }
 }

 /**
  * Email form control getter
  */
 get emailControl() {
  return this.loginForm.get('email');
 }

 /**
  * Password form control getter
  */
 get passwordControl() {
  return this.loginForm.get('password');
 }
}
