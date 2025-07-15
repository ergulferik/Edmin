import { Component, Input, Output, EventEmitter, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ClassItem, Field } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash, heroPlus } from '@ng-icons/heroicons/outline';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent, ModalFormConfig } from '../modal/modal-form/modal-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    NgIcon
  ],
  templateUrl: './class-list.html',
  styleUrl: './class-list.scss',
  viewProviders: [provideIcons({ heroPencilSquare, heroTrash, heroPlus })]
})
export class ClassList implements OnInit {
  @Input() classes: ClassItem[] = [];
  @Input() selectedClass: ClassItem | null = null;
  @Input() selectedField: string = 'all';
  @Input() filteredClasses: ClassItem[] = [];

  @Output() classSelected = new EventEmitter<ClassItem>();
  @Output() dragOver = new EventEmitter<{ event: DragEvent, classItem: ClassItem }>();
  @Output() drop = new EventEmitter<{ event: DragEvent, classItem: ClassItem }>();
  @Output() addNewClass = new EventEmitter<void>();

  classService = inject(ClassService);
  dialog = inject(MatDialog);
  private router = inject(Router);
  fields = signal<Field[]>([]);

  // Modal Form Configuration
  modalConfig: ModalFormConfig = {
    title: 'Sınav Ekle',
    subtitle: 'Yeni sınav bilgilerini girin',
    fields: [
      {
        key: 'name',
        label: 'Sınıf Adı',
        type: 'text',
        placeholder: 'Sınıf ismi...',
        required: true,
      },
      {
        key: 'fieldId',
        label: 'Sınıf alanı',
        type: 'select',
      }
    ],
    submitText: 'Kaydet',
    cancelText: 'İptal',
    width: '500px'
  };

  constructor() {
    effect(async () => {
      this.fields.set(await this.classService.getFields());
      this.updateModalFields();
    });
  }

  ngOnInit() {
    // Component başlatıldığında filteredClasses'ı classes'a eşitle
    if (this.filteredClasses.length === 0) {
      this.filteredClasses = this.classes;
    }
  }

  // Sınıf seçimi
  selectClass(classItem: ClassItem) {
    this.classSelected.emit(classItem);
  }

  // Drag over event handler
  onDragOver(event: DragEvent, classItem: ClassItem) {
    this.dragOver.emit({ event, classItem });
  }

  // Drop event handler
  onDrop(event: DragEvent, classItem: ClassItem) {
    this.drop.emit({ event, classItem });
  }

  // Sınıf ekleme modal formu aç
  onAddNewClass() {
    this.modalConfig.title = 'Sınıf Ekle';
    this.modalConfig.subtitle = 'Yeni sınıf bilgilerini girin';
    this.modalConfig.fields.forEach(field => {
      field.value = '';
    });
    
    const dialogRef = this.dialog.open(ModalFormComponent, {
      data: {
        config: this.modalConfig
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.createClass(result);
      }
    });
  }

  // Field bilgisini getir
  getFieldById(id: string): Field {
    return this.fields().find(f => f.id === id)!;
  }

  // Badge class'ını belirle
  getBadgeClass(index: number): string {
    if (this.selectedField === 'all') {
      return index % 2 === 0 ? 'even' : 'odd';
    }
    return 'even';
  }

  updateModalFields() {
    const field = this.modalConfig.fields.find(field => field.key === 'fieldId');
    if (field) {
      field.options = this.fields().map(field => ({
        label: field.name,
        value: field.id
      }));
    }
  }

  onEditClass(classItem: ClassItem) {
    this.modalConfig.title = 'Sınıf Düzenle';
    this.modalConfig.subtitle = 'Sınıf bilgilerini düzenleyin';
    this.modalConfig.fields.forEach(field => {
      field.value = classItem[field.key as keyof ClassItem];
    });


    const dialogRef = this.dialog.open(ModalFormComponent, {
      data: {
        config: this.modalConfig
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.updateClass(classItem.id, result);
      }
    });
  }

  onDeleteClass(classItem: ClassItem) {
    Swal.fire({
      html: `<strong>${classItem.name}</strong> sınıfını silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      confirmButtonText: 'Evet',
      confirmButtonColor: 'var(--error-600)',
      showCancelButton: true,
      cancelButtonText: 'Hayır',
      cancelButtonColor: 'var(--primary-600)',
      focusCancel:true
    }).then((result) => {
        if (result.isConfirmed) {
        this.classService.deleteClass(classItem.id);
      }
    });
  }
}
