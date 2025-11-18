import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IPermission, perms, findPermissionById, getParentPermission } from '../../../data/perms';
import { DcToastService } from 'dc-toast-ng';
import Swal from 'sweetalert2';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroTrash, heroArrowPath } from '@ng-icons/heroicons/outline';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Avatar } from '../../../components/avatar/avatar';
import { AppButtonComponent } from '../../../components/button/button';
import { PageHeaderComponent } from '../../../components/page/page-header/page-header';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { CardComponent } from '../../../components/card/card';
import { IRole, UserInfo } from '../../../models/user.model';
import { PermissionService } from '../../../services/permission.service';
import { RoleService } from '../../../services/role.service';
/**
 * View mode enum
 * @description Görünüm modları
 */
export enum ViewMode {
 LIST = 'list',
 DETAIL = 'detail',
}

/**
 * Role management page
 * @description Rol yönetimi sayfası - modern kart tabanlı tasarım
 */
@Component({
 selector: 'app-role-management',
 templateUrl: './role-management.html',
 styleUrls: ['./role-management.scss'],
 standalone: true,
 imports: [
  CommonModule,
  ReactiveFormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  PageHeaderComponent,
  Avatar,
  HasPermissionDirective,
  NgIcon,
  MatExpansionModule,
  MatAccordion,
  MatCheckboxModule,
  AppButtonComponent,
  PageHeaderComponent,
  CardComponent,
 ],
 providers: [
  provideIcons({
   heroPlus,
   heroTrash,
   heroArrowPath,
  }),
 ],
})
export class RoleManagementPage implements OnInit {
 private roleService = inject(RoleService);
 private permissionService = inject(PermissionService);
 private fb = inject(FormBuilder);
 private toast = inject(DcToastService);

 permissions = perms;
 // Expose enum to template
 ViewMode = ViewMode;

 // State signals
 roles = signal<IRole[]>([]);
 selectedRole = signal<IRole | null>(null);
 viewMode = signal<ViewMode>(ViewMode.LIST);
 searchQuery = signal<string>('');
 isEditMode = signal<boolean>(false);
 isLoading = signal<boolean>(false);

 // Form
 roleForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  description: ['', [Validators.maxLength(200)]],
  isActive: [true],
  permissions: [[]],
  isDefault: [false],
 });

 // Computed signals
 filteredRoles = computed(() => {
  const query = this.searchQuery().toLowerCase();
  if (!query) return this.roles();
  return this.roles().filter(
   role => role.name.toLowerCase().includes(query) || role.description?.toLowerCase().includes(query)
  );
 });

 /**
  * Component başlatıldığında
  */
 ngOnInit(): void {
  this.loadRoles();
 }

 /**
  * Rolleri yükler
  */
 async loadRoles(): Promise<void> {
  this.isLoading.set(true);
  const roles = await this.roleService.getRoles();
  this.roles.set(roles);
  this.isLoading.set(false);
 }

 /**
  * Rol seçildiğinde
  * @param role - Seçilen rol
  */
 selectRole(role: IRole): void {
  if (this.isEditMode()) {
   Swal.fire({
    text: 'Yaptığınız değişiklikler kaybolacaktır. Devam etmek istediğinize emin misiniz?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Evet, Devam Et',
    cancelButtonText: 'İptal',
   }).then(result => {
    if (result.isConfirmed) {
     this.changeRole(role);
    }
   });
  } else {
   this.changeRole(role);
  }
 }

 changeRole(role: IRole) {
  this.selectedRole.set(role);
  this.roleForm.patchValue({
   name: role.name,
   description: role.description || '',
   permissions: structuredClone(role.permissions),
   isActive: role.isActive === true,
   isDefault: role.isDefault === true,
  });
  this.viewMode.set(ViewMode.DETAIL);
 }

 /**
  * Liste görünümüne dön
  */
 backToList(): void {
  this.viewMode.set(ViewMode.LIST);
  this.selectedRole.set(null);
  this.isEditMode.set(false);
  this.roleForm.reset();
 }

 /**
  * Yeni rol ekleme
  */
 onAddClick(): void {
  this.isEditMode.set(false);
  this.selectedRole.set(null);
  this.roleForm.reset({
   name: '',
   description: '',
   isActive: true,
   permissions: [],
   isDefault: false,
  });
  this.viewMode.set(ViewMode.DETAIL);
 }

 /**
  * Rol düzenleme
  */
 editRole(role: IRole): void {
  this.isEditMode.set(true);
  this.selectedRole.set(role);
  this.roleForm.patchValue({
   name: role.name,
   description: role.description || '',
   isActive: role.isActive !== false,
   isDefault: role.isDefault === true,
  });
  this.viewMode.set(ViewMode.DETAIL);
 }

 /**
  * Rol silme
  */
 deleteRole(role: IRole): void {
  if (this.roleForm.value.isDefault == true) {
   Swal.fire({
    text: 'Varsayılan rol silinemez!',
    icon: 'warning',
    confirmButtonText: 'Tamam',
   });
   return;
  } else {
   Swal.fire({
    title: 'Emin misiniz?',
    text: `"${role.name}" rolü silinecek. Bu işlem geri alınamaz!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Evet, Sil',
    cancelButtonText: 'İptal',
   }).then(async result => {
    if (result.isConfirmed) {
     await this.roleService.deleteRole(role.id);
     await this.loadRoles();
     if (this.selectedRole()?.id === role.id) {
      this.backToList();
     }
     this.toast.create({
      position: 'bottom-center',
      content: 'Rol başarıyla silindi.',
      type: 'success',
      time: 3,
     });
    }
   });
  }
 }

 /**
  * Rol kaydetme
  */
 async saveRole() {
  if (this.roleForm.invalid) {
   this.roleForm.markAllAsTouched();
   return;
  }

  const roleData = {
   name: this.roleForm.value.name,
   description: this.roleForm.value.description,
   permissionIds: this.roleForm.value.permissions,
   isDefault: this.roleForm.value.isDefault,
   isActive: this.roleForm.value.isActive,
  };

  if (this.isEditMode() && this.selectedRole()) {
   await this.roleService.updateRole(this.selectedRole()!.id, roleData);
   await this.loadRoles();
   this.isEditMode.set(false);
   this.toast.create({
    position: 'bottom-center',
    content: 'Rol başarıyla güncellendi.',
    type: 'success',
    time: 3,
   });
  } else {
   await this.roleService.createRole(roleData);
   await this.loadRoles();
   this.isEditMode.set(false);
   this.toast.create({
    position: 'bottom-center',
    content: 'Rol başarıyla oluşturuldu.',
    type: 'success',
    time: 3,
   });
  }
 }

 /**
  * Avatar baş harflerini alır
  * @param user - Kullanıcı
  * @returns Baş harfler
  */
 getInitials(user: UserInfo): string {
  if (!user.name || !user.surname) return '?';
  return (user.name.charAt(0) + user.surname.charAt(0)).toUpperCase();
 }

 /**
  * Tarih formatlar
  * @param date - Tarih
  * @returns Formatlanmış tarih
  */
 formatDate(date?: Date | string): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR', {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
  });
 }

 /**
  * İzin açıklamasını alır
  * @param permissionId - İzin ID
  * @returns İzin açıklaması
  */
 getPermissionDescription(permissionId: string): string {
  const perm = findPermissionById(permissionId, perms);
  return perm?.desc || permissionId;
 }

 togglePermission(permissionId: string): void {
  if (this.selectedRole() && !this.isEditMode()) return;
  const permissions = this.roleForm.value.permissions;
  if (permissions.includes(permissionId)) {
   permissions.splice(permissions.indexOf(permissionId), 1);
  } else {
   permissions.push(permissionId);
  }
  const parentPermission = getParentPermission(permissionId, perms);
  if (parentPermission && !permissions.includes(parentPermission.id)) {
   permissions.push(parentPermission.id);
  }

  this.roleForm.patchValue({
   permissions: permissions,
  });
 }

 changeParentPermission(permission: IPermission): void {
  if (this.selectedRole() && !this.isEditMode()) return;
  const permissions = this.roleForm.value.permissions;
  if (permissions.includes(permission.id)) {
   if (permission.child) {
    permission.child.forEach(child => {
     if (this.roleForm.value.permissions.includes(child.id)) {
      this.roleForm.value.permissions.splice(this.roleForm.value.permissions.indexOf(child.id), 1);
     }
    });
   }
   permissions.splice(permissions.indexOf(permission.id), 1);
  } else {
   permissions.push(permission.id);
  }
  this.roleForm.patchValue({
   permissions: permissions,
  });
 }

 checkPerm(permissionId: string): boolean {
  return this.roleForm.value.permissions.includes(permissionId);
 }

 onCancelClick(): void {
  if (this.isEditMode()) {
   this.isEditMode.set(false);
   this.roleForm.reset();
   this.roleForm.patchValue({
    permissions: this.selectedRole()?.permissions || [],
   });
  } else {
   this.backToList();
  }
 }

 changeDefaultRole(): void {
  this.roleForm.patchValue({
   isDefault: true,
  });
 }

 changeActiveStatus(isActive: boolean): void {
  if (this.roleForm.value.isDefault == true && isActive == false) {
   Swal.fire({
    text: 'Varsayılan rol pasif olarak ayarlanamaz!',
    icon: 'warning',
    confirmButtonText: 'Tamam',
   });
  } else {
   this.roleForm.patchValue({
    isActive: isActive,
   });
  }
 }
}
