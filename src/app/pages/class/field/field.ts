import { Component, Input, Output, EventEmitter, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Field } from '../../../models/class.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlus } from '@ng-icons/heroicons/outline';
import { HelperService } from '../../../services/helper.service';
import { DcToastService } from 'dc-toast-ng';
import Swal from 'sweetalert2';
import { ClassService } from '../../../services/class.service';

/**
 * FieldComponent manages the list of fields (branches) for classes. Supports add, edit, delete, and drag-and-drop sorting.
 */
@Component({
  selector: 'edmin-field',
  imports: [CommonModule, FormsModule, MatIconModule, DragDropModule, NgIcon],
  templateUrl: './field.html',
  styleUrl: './field.scss',
  viewProviders: [
    provideIcons({
      heroTrash,
      heroPlus,
    }),
  ],
})
export class FieldComponent {
  /** Currently selected field id */
  @Input()
  selectedField: string = 'all';
  /** Emits when a field is selected */
  @Output()
  fieldSelected = new EventEmitter<Field>();
  /** Emits when fields are updated */
  @Output()
  fieldsUpdated = new EventEmitter<{
    fields: Field[];
    selectedField: string;
  }>();
  /** List of fields (reactive) */
  fields = signal<Field[]>([]);
  /** Field being edited */
  editingField: Field | null = null;
  /** Field being dragged */
  draggingField: Field | null = null;
  /** Is the trash zone active? */
  isTrashZone: boolean = false;

  toast = inject(DcToastService);
  helperService = inject(HelperService);
  classService = inject(ClassService);
  constructor() {
    effect(() => {
      this.fields.set(this.classService.fields());
    });
  }

  /**
   * Emits the selected field for filtering.
   */
  filterByField(field: Field) {
    this.fieldSelected.emit(field);
  }

  /**
   * Starts editing a field.
   */
  startEditField(field: Field) {
    if (field.id === 'all') return;
    this.editingField = field;
  }

  /**
   * Saves the edited field name.
   */
  saveEditField(value?: string) {
    if (this.editingField !== null && (value?.trim() || '').length > 0) {
      const updatedFields = this.fields().map(f =>
        f.id === this.editingField?.id
          ? {
              ...this.editingField,
              name: value?.trim() || '',
            }
          : f
      );
      this.fields.set(updatedFields);
      this.fieldsUpdated.emit({
        fields: updatedFields,
        selectedField: this.selectedField,
      });
      this.editingField = null;
    } else {
      this.toast.create({
        position: 'bottom-center',
        content: 'Field name cannot be empty',
        type: 'error',
        time: 3,
        allowTimeBar: true,
      });
    }
  }

  /**
   * Cancels field editing.
   */
  cancelEditField() {
    if (this.editingField) {
      this.editingField = null;
    }
  }

  /**
   * Deletes a field after confirmation.
   */
  async deleteField(fieldId: string) {
    const result = await Swal.fire({
      html: `<strong>${this.fields().find(f => f.id === fieldId)?.name}</strong> will be deleted. Are you sure?`,
      icon: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: 'var(--error-600)',
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: 'var(--primary-600)',
      focusCancel: true,
    });
    if (result.isConfirmed) {
      const updatedFields = this.fields().filter(f => f.id !== fieldId);
      this.fields.set(updatedFields);
      this.fieldsUpdated.emit({
        fields: updatedFields,
        selectedField: this.selectedField,
      });
    }
  }

  /**
   * Adds a new field.
   */
  addNewField() {
    const nextId = this.helperService.generateRandomId();
    const nextOrder = Math.max(...this.fields().map(f => f.order), 0) + 1;
    const newField = {
      id: nextId,
      name: 'New Field',
      order: nextOrder,
    };
    this.editingField = newField;
    const updatedFields = [...this.fields(), newField];
    this.fields.set(updatedFields);
    this.fieldsUpdated.emit({
      fields: updatedFields,
      selectedField: this.selectedField,
    });
  }

  /**
   * Handles drag-and-drop sorting of fields.
   */
  onFieldDrop(event: any) {
    const fromIndex = event.previousIndex;
    const toIndex = event.currentIndex;
    if (fromIndex !== toIndex) {
      const fieldsCopy = [...this.fields()];
      const [movedField] = fieldsCopy.splice(fromIndex, 1);
      fieldsCopy.splice(toIndex, 0, movedField);
      const reorderedFields = fieldsCopy.map((field, index) => ({
        ...field,
        order: index + 1,
      }));
      this.fields.set(reorderedFields);
      this.fieldsUpdated.emit({
        fields: reorderedFields,
        selectedField: this.selectedField,
      });
    }
  }

  /**
   * Handles drag start for a field.
   */
  onFieldDragStart(field: Field) {
    this.draggingField = field;
  }

  /**
   * Handles drag end for a field.
   */
  onFieldDragEnd(field: Field) {
    if (this.isTrashZone && field.id !== 'all') {
      this.deleteField(field.id);
    }
    this.draggingField = null;
    this.isTrashZone = false;
  }

  /**
   * Returns the list of field filters (sorted, includes all).
   */
  getFieldFilters(): Field[] {
    return [
      ...this.fields()
        .slice()
        .sort((a, b) => a.order - b.order),
    ];
  }
}
