/**
 * Permission interface
 * @description Hiyerarşik izin yapısını tanımlar
 */
export interface IPermission {
 /** İzin benzersiz kimliği (örn: 'student', 'student_edit', 'student_payment_history') */
 id: string;
 /** İzin açıklaması (Türkçe) */
 desc: string;
 /** Alt izinler (hiyerarşik yapı için) */
 child?: IPermission[];
}

/**
 * Permission tree structure
 * @description Tüm izinlerin hiyerarşik ağacı - backend ile aynı yapıda
 */
export const perms: IPermission[] = [
 {
  id: 'student',
  desc: 'Öğrenci İşlemleri',
  child: [
   {
    id: 'student_view',
    desc: 'Öğrenci Görüntüleme',
   },
   {
    id: 'student_create',
    desc: 'Öğrenci Oluşturma',
   },
   {
    id: 'student_edit',
    desc: 'Öğrenci Düzenleme',
   },
   {
    id: 'student_delete',
    desc: 'Öğrenci Silme',
   },
   {
    id: 'student_payment_history',
    desc: 'Ödeme Geçmişi',
   },
   {
    id: 'student_attendance',
    desc: 'Devam Takibi',
   },
   {
    id: 'student_contract',
    desc: 'Sözleşme İşlemleri',
   },
  ],
 },
 {
  id: 'class',
  desc: 'Sınıf İşlemleri',
  child: [
   {
    id: 'class_view',
    desc: 'Sınıf Görüntüleme',
   },
   {
    id: 'class_create',
    desc: 'Sınıf Oluşturma',
   },
   {
    id: 'class_edit',
    desc: 'Sınıf Düzenleme',
   },
   {
    id: 'class_delete',
    desc: 'Sınıf Silme',
   },
   {
    id: 'class_schedule',
    desc: 'Ders Programı',
   },
   {
    id: 'class_student_management',
    desc: 'Sınıf Öğrenci Yönetimi',
   },
  ],
 },
 {
  id: 'teacher',
  desc: 'Öğretmen İşlemleri',
  child: [
   {
    id: 'teacher_view',
    desc: 'Öğretmen Görüntüleme',
   },
   {
    id: 'teacher_create',
    desc: 'Öğretmen Oluşturma',
   },
   {
    id: 'teacher_edit',
    desc: 'Öğretmen Düzenleme',
   },
   {
    id: 'teacher_delete',
    desc: 'Öğretmen Silme',
   },
   {
    id: 'teacher_schedule',
    desc: 'Öğretmen Programı',
   },
  ],
 },
 {
  id: 'appointment',
  desc: 'Randevu İşlemleri',
  child: [
   {
    id: 'appointment_view',
    desc: 'Randevu Görüntüleme',
   },
   {
    id: 'appointment_create',
    desc: 'Randevu Oluşturma',
   },
   {
    id: 'appointment_edit',
    desc: 'Randevu Düzenleme',
   },
   {
    id: 'appointment_delete',
    desc: 'Randevu Silme',
   },
   {
    id: 'appointment_attendance',
    desc: 'Randevu Devam Takibi',
   },
  ],
 },
 {
  id: 'payment',
  desc: 'Ödeme İşlemleri',
  child: [
   {
    id: 'payment_view',
    desc: 'Ödeme Görüntüleme',
   },
   {
    id: 'payment_create',
    desc: 'Ödeme Oluşturma',
   },
   {
    id: 'payment_edit',
    desc: 'Ödeme Düzenleme',
   },
   {
    id: 'payment_delete',
    desc: 'Ödeme Silme',
   },
   {
    id: 'payment_receipt',
    desc: 'Makbuz İşlemleri',
   },
   {
    id: 'payment_installment',
    desc: 'Taksit Yönetimi',
   },
  ],
 },
 {
  id: 'accounting',
  desc: 'Muhasebe İşlemleri',
  child: [
   {
    id: 'accounting_view',
    desc: 'Muhasebe Görüntüleme',
   },
   {
    id: 'accounting_report',
    desc: 'Muhasebe Raporları',
   },
   {
    id: 'accounting_invoice',
    desc: 'Fatura İşlemleri',
   },
  ],
 },
 {
  id: 'personnel',
  desc: 'Personel İşlemleri',
  child: [
   {
    id: 'personnel_view',
    desc: 'Personel Görüntüleme',
   },
   {
    id: 'personnel_create',
    desc: 'Personel Oluşturma',
   },
   {
    id: 'personnel_edit',
    desc: 'Personel Düzenleme',
   },
   {
    id: 'personnel_delete',
    desc: 'Personel Silme',
   },
  ],
 },
 {
  id: 'exam',
  desc: 'Sınav İşlemleri',
  child: [
   {
    id: 'exam_view',
    desc: 'Sınav Görüntüleme',
   },
   {
    id: 'exam_create',
    desc: 'Sınav Oluşturma',
   },
   {
    id: 'exam_edit',
    desc: 'Sınav Düzenleme',
   },
   {
    id: 'exam_delete',
    desc: 'Sınav Silme',
   },
   {
    id: 'exam_template',
    desc: 'Sınav Şablonu',
   },
  ],
 },
 {
  id: 'course',
  desc: 'Ders İşlemleri',
  child: [
   {
    id: 'course_view',
    desc: 'Ders Görüntüleme',
   },
   {
    id: 'course_create',
    desc: 'Ders Oluşturma',
   },
   {
    id: 'course_edit',
    desc: 'Ders Düzenleme',
   },
   {
    id: 'course_delete',
    desc: 'Ders Silme',
   },
  ],
 },
 {
  id: 'role',
  desc: 'Rol Yönetimi',
  child: [
   {
    id: 'role_view',
    desc: 'Rol Görüntüleme',
   },
   {
    id: 'role_create',
    desc: 'Rol Oluşturma',
   },
   {
    id: 'role_edit',
    desc: 'Rol Düzenleme',
   },
   {
    id: 'role_delete',
    desc: 'Rol Silme',
   },
   {
    id: 'role_assign',
    desc: 'Rol Atama',
   },
  ],
 },
 {
  id: 'user',
  desc: 'Kullanıcı Yönetimi',
  child: [
   {
    id: 'user_view',
    desc: 'Kullanıcı Görüntüleme',
   },
   {
    id: 'user_create',
    desc: 'Kullanıcı Oluşturma',
   },
   {
    id: 'user_edit',
    desc: 'Kullanıcı Düzenleme',
   },
   {
    id: 'user_delete',
    desc: 'Kullanıcı Silme',
   },
   {
    id: 'user_role_assign',
    desc: 'Kullanıcı Rol Atama',
   },
  ],
 },
];

/**
 * Flatten permission tree to array of permission IDs
 * @param permissions - Permission tree array
 * @returns Flat array of all permission IDs
 */
export function flattenPermissions(permissions: IPermission[]): string[] {
 const result: string[] = [];

 const traverse = (perms: IPermission[]) => {
  for (const perm of perms) {
   result.push(perm.id);
   if (perm.child && perm.child.length > 0) {
    traverse(perm.child);
   }
  }
 };

 traverse(permissions);
 return result;
}

/**
 * Get all permission IDs as a flat array
 * @returns Array of all permission IDs
 */
export function getAllPermissionIds(): string[] {
 return flattenPermissions(perms);
}

/**
 * Find permission by ID in the tree
 * @param permissionId - Permission ID to find
 * @param permissions - Permission tree to search in
 * @returns Found permission or null
 */
export function findPermissionById(permissionId: string, permissions: IPermission[] = perms): IPermission | null {
 for (const perm of permissions) {
  if (perm.id === permissionId) {
   return perm;
  }
  if (perm.child) {
   const found = findPermissionById(permissionId, perm.child);
   if (found) {
    return found;
   }
  }
 }
 return null;
}

/**
 * Check if a permission is child of another permission
 * @param parentId - Parent permission ID
 * @param childId - Child permission ID to check
 * @param permissions - Permission tree to search in
 * @returns True if childId is a child (direct or nested) of parentId
 */
export function isChildPermission(parentId: string, childId: string, permissions: IPermission[] = perms): boolean {
 const parent = findPermissionById(parentId, permissions);
 if (!parent) {
  return false;
 }

 const allChildren = flattenPermissions(parent.child || []);
 return allChildren.includes(childId) || parent.id === childId;
}

export function getParentPermission(permissionId: string, permissions: IPermission[] = perms): IPermission | null {
 for (const perm of permissions || []) {
  if (perm.child?.some(child => child.id === permissionId)) {
   return perm;
  }
  if (perm.child) {
   const found = getParentPermission(permissionId, perm.child);
   if (found) {
    return found;
   }
  }
 }
 return null;
}
