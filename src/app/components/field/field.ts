import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Field } from '../../models/class.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlus } from '@ng-icons/heroicons/outline';
import { HelperService } from '../../services/helper.service';
import { DcToastService } from 'dc-toast-ng';
import Swal from 'sweetalert2'
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'edmin-field',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    DragDropModule,
    NgIcon
  ],
  templateUrl: './field.html',
  styleUrl: './field.scss',
  viewProviders: [provideIcons({ heroTrash, heroPlus })]
})
export class FieldComponent {
  @Input() selectedField: string = 'all';
  @Output() fieldSelected = new EventEmitter<Field>();
  @Output() fieldsUpdated = new EventEmitter<{fields: Field[], selectedField: string}>();

  fields = signal<Field[]>([]);

  // Field düzenleme
  editingField: Field | null = null;
  draggingField: Field | null = null;
  isTrashZone: boolean = false;

  constructor(
    private toast:DcToastService , 
    private helperService: HelperService,
    private classService: ClassService
  ) { 
    effect(async () => {
      this.fields.set(await this.classService.getFields());
    });
  }

  // Alan filtresi
  filterByField(field: Field) {
    this.fieldSelected.emit(field);
  }

  // Field düzenleme başlat
  startEditField(field: Field) {
    if (field.id === 'all') return;
    this.editingField = field;
  }

  // Field düzenleme kaydet
  saveEditField(value?: string) {
    if (this.editingField !== null && (value?.trim() || '').length > 0) {
      const updatedFields = this.fields().map(f => 
        f.id === this.editingField?.id 
          ? { ...this.editingField, name: value?.trim() || '' } 
          : f
      );
      this.fields.set(updatedFields);
      this.fieldsUpdated.emit({fields:updatedFields, selectedField: this.selectedField});
      this.editingField = null;
    } else {
      this.toast.create({
        position:'bottom-center',
        content:'Alan adı boş bırakılamaz',
        type:'error',
        time:3,
        allowTimeBar:true
      })
    }
  }

  // Field düzenleme iptal
  cancelEditField() {
    if (this.editingField) {
      this.editingField = null;
    }
  }

  // Field sil
  async deleteField(fieldId: string) {
    const result = await Swal.fire({
      html: `<strong>${this.fields().find(f => f.id === fieldId)?.name}</strong> alanını silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      confirmButtonText: 'Evet',
      confirmButtonColor: 'var(--error-600)',
      showCancelButton: true,
      cancelButtonText: 'Hayır',
      cancelButtonColor: 'var(--primary-600)',
      focusCancel:true
    })
    if (result.isConfirmed) {
      const updatedFields = this.fields().filter(f => f.id !== fieldId);
      this.fields.set(updatedFields);
      this.fieldsUpdated.emit({fields:updatedFields, selectedField: this.selectedField});
    }
  }

  // Yeni field ekle
  addNewField() {
    const nextId = this.helperService.generateRandomId();
    const nextOrder = Math.max(...this.fields().map(f => f.order), 0) + 1;

    const newField = {
      id: nextId,
      name: 'Yeni Alan',
      order: nextOrder
    };
    this.editingField = newField;

    const updatedFields = [...this.fields(), newField];
    this.fields.set(updatedFields);
    this.fieldsUpdated.emit({fields:updatedFields, selectedField: this.selectedField});
  }

  // Drag & Drop sıralama
  onFieldDrop(event: any) {
    const fromIndex = event.previousIndex;
    const toIndex = event.currentIndex;

    if (fromIndex !== toIndex) {
      const fieldsCopy = [...this.fields()];
      const [movedField] = fieldsCopy.splice(fromIndex, 1);
      fieldsCopy.splice(toIndex, 0, movedField);

      const reorderedFields = fieldsCopy.map((field, index) => ({
        ...field,
        order: index + 1
      }));

      this.fields.set(reorderedFields);
      this.fieldsUpdated.emit({fields:reorderedFields, selectedField: this.selectedField});
    }
  }

  onFieldDragStart(field: Field) {
    this.draggingField = field;
  }

  onFieldDragEnd(field: Field) {
    if (this.isTrashZone && field.id !== 'all') {
      this.deleteField(field.id);
    }
    this.draggingField = null;
    this.isTrashZone = false;
  }

  // Alan filtrelerini al (Tümü dahil)
  getFieldFilters(): Field[] {
    return [...this.fields().slice().sort((a, b) => a.order - b.order)];
  }
}
