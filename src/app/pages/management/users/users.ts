import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../components/page/page-header/page-header';
import { CardComponent } from '../../../components/card/card';
import {
 DataGridComponent,
 DataGridConfig,
 DataGridColumn,
 DataGridAction,
} from '../../../components/data-grid/data-grid';
import { Avatar } from '../../../components/avatar/avatar';
import { UserInfo, IRole } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { AppButtonComponent } from '../../../components/button/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';
import Swal from 'sweetalert2';
import { UserAddModal, UserType } from './add/add-modal/add-modal';

/**
 * View mode enum
 * @description Görünüm modları
 */
export enum ViewMode {
 CARD = 'card',
 GRID = 'grid',
}

/**
 * Users management page
 * @description Kullanıcı yönetimi sayfası
 */
@Component({
 selector: 'app-users',
 templateUrl: './users.html',
 styleUrls: ['./users.scss'],
 standalone: true,
 imports: [
  CommonModule,
  FormsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  PageHeaderComponent,
  CardComponent,
  DataGridComponent,
  Avatar,
  AppButtonComponent,
  NgIcon,
 ],
 providers: [
  provideIcons({
   heroPlus,
  }),
 ],
})
export class UsersPage implements OnInit {
 private userService = inject(UserService);
 private roleService = inject(RoleService);
 private dialog = inject(MatDialog);
 private router = inject(Router);
 // Expose enum to template
 ViewMode = ViewMode;

 // State signals
 users = signal<UserInfo[]>([]);
 roles = signal<IRole[]>([]);
 viewMode = signal<ViewMode>(ViewMode.CARD);
 searchQuery = signal<string>('');
 selectedRoleFilter = signal<string>('');
 selectedStatusFilter = signal<string>('');
 isLoading = signal<boolean>(false);
 editingUser = signal<UserInfo | null>(null);

 // Data grid configuration
 dataGridConfig: DataGridConfig = {
  title: 'Kullanıcılar',
  subtitle: 'Tüm kullanıcıları görüntüleyin ve yönetin',
  columns: this.getDataGridColumns(),
  searchableColumns: ['name', 'surname', 'email'],
  searchPlaceholder: 'Kullanıcı ara...',
  showSearch: true,
  showAddButton: true,
  addButtonText: 'Yeni Kullanıcı',
  maxHeight: '600px',
 };

 // Data grid actions
 dataGridActions: DataGridAction[] = [
  {
   type: 'edit',
   icon: 'heroPencilSquare',
   label: 'Düzenle',
   color: 'primary',
   onClick: (user: UserInfo) => this.onEditUser(user),
  },
  {
   type: 'delete',
   icon: 'heroTrash',
   label: 'Sil',
   color: 'warn',
   onClick: (user: UserInfo) => this.onDeleteUser(user),
  },
 ];

 // Computed signals
 filteredUsers = computed(() => {
  let filtered = this.users();

  // Search filter
  const query = this.searchQuery().toLowerCase();
  if (query) {
   filtered = filtered.filter(
    user =>
     user.name?.toLowerCase().includes(query) ||
     user.surname?.toLowerCase().includes(query) ||
     user.email?.toLowerCase().includes(query)
   );
  }

  // Role filter
  const roleFilter = this.selectedRoleFilter();
  if (roleFilter) {
   filtered = filtered.filter(user => user.roles?.some(role => role.id === roleFilter));
  }

  // Status filter
  const statusFilter = this.selectedStatusFilter();
  if (statusFilter === 'active') {
   filtered = filtered.filter(user => user.isActive !== false);
  } else if (statusFilter === 'inactive') {
   filtered = filtered.filter(user => user.isActive === false);
  }

  return filtered;
 });

 /**
  * Component başlatıldığında
  */
 ngOnInit(): void {
  this.loadUsers();
  this.loadRoles();
 }

 /**
  * Kullanıcıları yükler
  */
 async loadUsers(): Promise<void> {
  this.isLoading.set(true);
  const users = await this.userService.getUsers();
  this.users.set(users);
  this.isLoading.set(false);
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
  * Data grid kolonlarını döndürür
  * @returns Data grid kolonları
  */
 getDataGridColumns(): DataGridColumn[] {
  return [
   {
    key: 'avatar',
    label: '',
    type: 'avatar',
    width: '60px',
    alternative: (user: UserInfo) => this.getInitials(user),
   },
   {
    key: 'name',
    label: 'Ad',
    type: 'text',
    width: '150px',
   },
   {
    key: 'surname',
    label: 'Soyad',
    type: 'text',
    width: '150px',
   },
   {
    key: 'email',
    label: 'E-posta',
    type: 'text',
    width: '200px',
   },
   {
    key: 'roles',
    label: 'Roller',
    type: 'text',
    width: '200px',
    alternative: (user: UserInfo) => this.getRolesString(user),
   },
   {
    key: 'isActive',
    label: 'Durum',
    type: 'boolean',
    width: '100px',
   },
   {
    key: 'createdAt',
    label: 'Oluşturulma Tarihi',
    type: 'date',
    width: '150px',
   },
  ];
 }

 /**
  * Görünüm modunu değiştirir
  * @param mode Görünüm modu
  */
 switchViewMode(mode: ViewMode): void {
  this.viewMode.set(mode);
 }

 /**
  * Arama terimi değiştiğinde
  * @param searchTerm Arama terimi
  */
 onSearchChange(searchTerm: string): void {
  this.searchQuery.set(searchTerm);
 }

 /**
  * Kullanıcı seçildiğinde
  * @param user Seçilen kullanıcı
  */
 selectUser(user: UserInfo): void {
  // TODO: API bağlantısı eklenecek
  console.log('User selected:', user);
 }

 /**
  * Kullanıcı düzenleme
  * @param user Düzenlenecek kullanıcı
  */
 onEditUser(user: UserInfo): void {
  this.editingUser.set(user);
 }

 /**
  * Kullanıcı silme
  * @param user Silinecek kullanıcı
  */
 async onDeleteUser(user: UserInfo): Promise<void> {
  const result = await Swal.fire({
   html: `<strong>${user.name} ${user.surname}</strong> kullanıcısını silmek istediğinizden emin misiniz?`,
   icon: 'warning',
   confirmButtonText: 'Evet',
   confirmButtonColor: 'var(--primary-600)',
   showCancelButton: true,
   cancelButtonText: 'Hayır',
   cancelButtonColor: 'var(--error-600)',
  });

  if (result.isConfirmed) {
   try {
    await this.userService.deleteUser(user.id);
    await this.loadUsers();
   } catch (error) {
    console.error('Kullanıcı silinirken hata oluştu:', error);
   }
  }
 }

 /**
  * Yeni kullanıcı ekleme
  */
 onAddUser(): void {
  this.onAddClick();
 }

 /**
  * Yeni kullanıcı ekleme (card view için)
  */
 onAddClick(): void {
  this.dialog
   .open(UserAddModal, {
    width: '90%',
    maxWidth: '1200px',
    panelClass: 'user-add-modal',
   })
   .afterClosed()
   .subscribe(result => {
    if (result) {
     // Seçilen kullanıcı tipine göre işlem yapılacak
     console.log('Seçilen kullanıcı tipi:', result);

     // Student seçildiğinde add-student sayfasına yönlendir
     if (result === UserType.STUDENT) {
      this.router.navigate(['/add-student']);
     }
     // TODO: Diğer kullanıcı tipleri için de routing eklenebilir
    }
   });
 }

 /**
  * Kullanıcı ekleme
  * @param formData Form verileri
  */
 async addUser(formData: any): Promise<void> {
  try {
   // Şifre yoksa hata ver
   if (!formData.password) {
    await Swal.fire({
     icon: 'error',
     title: 'Hata',
     text: 'Şifre alanı zorunludur.',
     confirmButtonColor: 'var(--primary-600)',
    });
    return;
   }

   // Rol ID'sini roles array'ine çevir
   const userData: Partial<UserInfo> = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    password: formData.password,
    isActive: formData.isActive !== undefined ? formData.isActive : true,
   };

   if (formData.roles) {
    userData.roles = this.roles().filter(r => r.id === formData.roles);
   }

   await this.userService.createUser(userData);
   await this.loadUsers();
  } catch (error) {
   console.error('Kullanıcı eklenirken hata oluştu:', error);
  }
 }

 /**
  * Kullanıcı güncelleme
  * @param formData Form verileri
  */
 async updateUser(formData: any): Promise<void> {
  const currentEditingUser = this.editingUser();
  if (!currentEditingUser) return;

  try {
   // Rol ID'sini roles array'ine çevir
   const userData: Partial<UserInfo> = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    isActive: formData.isActive !== undefined ? formData.isActive : true,
   };

   // Şifre değiştirilmişse ekle
   if (formData.password && formData.password.trim() !== '') {
    userData.password = formData.password;
   }

   if (formData.roles) {
    userData.roles = this.roles().filter(r => r.id === formData.roles);
   }

   await this.userService.updateUser(currentEditingUser.id, userData);
   this.editingUser.set(null);
   await this.loadUsers();
  } catch (error) {
   console.error('Kullanıcı güncellenirken hata oluştu:', error);
  }
 }

 /**
  * Avatar baş harflerini alır
  * @param user Kullanıcı
  * @returns Baş harfler
  */
 getInitials(user: UserInfo): string {
  if (!user.name || !user.surname) return '?';
  return (user.name.charAt(0) + user.surname.charAt(0)).toUpperCase();
 }

 /**
  * Kullanıcının rollerini string olarak döndürür
  * @param user Kullanıcı
  * @returns Roller string'i
  */
 getRolesString(user: UserInfo): string {
  if (!user.roles || user.roles.length === 0) return 'Rol yok';
  return user.roles.map(role => role.name).join(', ');
 }

 /**
  * Tarih formatlar
  * @param date Tarih
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
  * Seçili rol filtresinin etiketini döndürür
  * @returns Rol filtresi etiketi
  */
 getSelectedRoleFilterLabel(): string {
  const roleId = this.selectedRoleFilter();
  if (!roleId) return 'Tüm Roller';
  const role = this.roles().find(r => r.id === roleId);
  return role ? role.name : 'Tüm Roller';
 }

 /**
  * Seçili durum filtresinin etiketini döndürür
  * @returns Durum filtresi etiketi
  */
 getSelectedStatusFilterLabel(): string {
  const status = this.selectedStatusFilter();
  if (!status) return 'Tüm Durumlar';
  if (status === 'active') return 'Aktif';
  if (status === 'inactive') return 'Pasif';
  return 'Tüm Durumlar';
 }
}
