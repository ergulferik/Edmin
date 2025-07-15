import { Component, Input, Output, EventEmitter, signal, WritableSignal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroPencil, heroTrash, heroMagnifyingGlass, heroDocument, heroDocumentText, heroDocumentDuplicate, heroTableCells, heroPhoto, heroArchiveBox, heroCheckCircle, heroXCircle } from '@ng-icons/heroicons/outline';
import { AppButtonComponent } from '../button/button';

export interface DataGridColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'actions' | 'boolean' | 'file' | 'template';
  width?: string;
  sortable?: boolean;
  data?: any;
  keyExpr?: string;
  displayExpr?: string;
}

export interface DataGridConfig {
  title: string;
  subtitle?: string;
  columns: DataGridColumn[];
  searchPlaceholder?: string;
  addButtonText?: string;
  showAddButton?: boolean;
  showSearch?: boolean;
  maxHeight?: string;
  addButtonType?: 'primary' | 'accent' | 'warn' | 'secondary' | 'outlined';
}

export interface DataGridAction {
  type: 'edit' | 'delete' | 'view' | 'custom';
  icon?: string;
  label?: string;
  color?: 'primary' | 'accent' | 'warn';
  onClick: (item: any) => void;
}

@Component({
  selector: 'edmin-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    NgIcon,
    AppButtonComponent
  ],
  templateUrl: './data-grid.html',
  styleUrls: ['./data-grid.scss'],
  viewProviders: [provideIcons({ heroPlus, heroPencil, heroTrash, heroMagnifyingGlass, heroDocument, heroDocumentText, heroDocumentDuplicate, heroTableCells, heroPhoto, heroArchiveBox, heroCheckCircle, heroXCircle })]
})
export class DataGridComponent {
  @Input() config!: DataGridConfig;
  @Input() data: Signal<any[]> = signal<any[]>([]);
  @Input() actions?: DataGridAction[];
  @Input() searchableColumns?: string[];
  @Input() loading?: boolean;
  @Input() error?: string;
  @Output() addClick = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  searchTerm = signal<string>('');

  filteredData = computed(() => {
    const currentData = this.data();
    const currentSearchTerm = this.searchTerm();
    if (!this.searchableColumns || this.searchableColumns.length < 1) return currentData;

    if (!currentSearchTerm.trim() || !this.searchableColumns?.length) {
      return currentData;
    }

    return currentData.filter((item: any) =>
      this.searchableColumns!.some(column =>
        item[column]?.toString().toLowerCase().includes(currentSearchTerm.toLowerCase())
      )
    );
  });

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }

  onAddClick() {
    this.addClick.emit();
  }

  onActionClick(action: DataGridAction, item: any) {
    action.onClick(item);
  }

  getDisplayedColumns(): string[] {
    const columns = this.config.columns.map(col => col.key);
    if (this.actions && this.actions.length > 0) {
      columns.push('actions');
    }
    return columns;
  }

  getColumnWidth(column: DataGridColumn): string {
    if (column.type === 'actions') {
      return '120px';
    }
    return column.width || 'auto';
  }

  formatDate(date: string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getFileIcon(file: File): string {
    if (!file) return 'heroDocument';

    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
      case 'pdf':
        return 'heroDocumentText';
      case 'doc':
      case 'docx':
        return 'heroDocumentDuplicate';
      case 'xls':
      case 'xlsx':
        return 'heroTableCells';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'heroPhoto';
      case 'zip':
      case 'rar':
        return 'heroArchiveBox';
      default:
        return 'heroDocument';
    }
  }

  getFileDisplayName(file: File): string {
    if (!file) return 'DOSYA YOK';

    // Dosya adını maksimum 20 karakter olarak göster
    if (file.name.length > 20) {
      const extension = file.name.split('.').pop() || '';
      const name = file.name.substring(0, 17);
      return `${name}...${extension}`;
    }

    return file.name;
  }

  getTemplateDisplayValue(value: any, data: any, keyExpr?: string, displayExpr?: string): string {
    if (!keyExpr || !displayExpr) return value;
    const template = data.find((item: any) => item[keyExpr] === value);
    return template ? template[displayExpr] : value;
  }
} 