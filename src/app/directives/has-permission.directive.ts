import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { Subscription } from 'rxjs';

/**
 * HasPermission directive
 * @description UI elementlerini izin kontrolüne göre gösterir/gizler
 *
 * @example
 * // Tek izin kontrolü:
 * <button *hasPermission="'student_create'">Yeni Öğrenci</button>
 *
 * // Birden fazla izin (en az biri):
 * <button *hasPermission="['student_create', 'student_edit']">Düzenle</button>
 *
 * // Tüm izinler gerekli:
 * <button *hasPermission="['student_view', 'student_edit']; requireAll: true">Düzenle</button>
 *
 * // Else template:
 * <div *hasPermission="'student_create'; else noPermission">
 *   <button>Yeni Öğrenci</button>
 * </div>
 * <ng-template #noPermission>
 *   <p>İzin yok</p>
 * </ng-template>
 */
@Directive({
 selector: '[hasPermission]',
 standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
 private templateRef = inject(TemplateRef<any>);
 private viewContainer = inject(ViewContainerRef);
 private permissionService = inject(PermissionService);
 private subscription?: Subscription;

 /** İzin ID veya izin ID'leri dizisi */
 @Input() hasPermission!: string | string[];

 /** Tüm izinler gerekli mi? (default: false - en az biri yeterli) */
 @Input() requireAll: boolean = false;

 /** Else template (izin yoksa gösterilecek) */
 @Input() hasPermissionElse?: TemplateRef<any>;

 /**
  * Directive başlatıldığında
  */
 ngOnInit(): void {
  this.checkPermission();
 }

 /**
  * İzin kontrolü yapar ve view'ı gösterir/gizler
  */
 private checkPermission(): void {
  if (!this.hasPermission) {
   this.showElseOrHide();
   return;
  }

  let hasAccess = false;

  if (Array.isArray(this.hasPermission)) {
   // Çoklu izin kontrolü
   if (this.requireAll) {
    hasAccess = this.permissionService.hasAllPermissions(this.hasPermission);
   } else {
    hasAccess = this.permissionService.hasAnyPermission(this.hasPermission);
   }
  } else {
   // Tek izin kontrolü
   hasAccess = this.permissionService.hasPermission(this.hasPermission);
  }

  if (hasAccess) {
   this.viewContainer.clear();
   this.viewContainer.createEmbeddedView(this.templateRef);
  } else {
   this.showElseOrHide();
  }
 }

 /**
  * Else template varsa gösterir, yoksa gizler
  */
 private showElseOrHide(): void {
  this.viewContainer.clear();
  if (this.hasPermissionElse) {
   this.viewContainer.createEmbeddedView(this.hasPermissionElse);
  }
 }

 /**
  * Directive yok edildiğinde
  */
 ngOnDestroy(): void {
  if (this.subscription) {
   this.subscription.unsubscribe();
  }
 }
}
