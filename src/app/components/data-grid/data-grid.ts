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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroPencil, heroTrash, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { AppButtonComponent } from '../button/button';

export interface DataGridColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'actions';
  width?: string;
  sortable?: boolean;
  searchable?: boolean;
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
    NgIcon,
    AppButtonComponent
  ],
  templateUrl: './data-grid.html',
  styleUrls: ['./data-grid.scss'],
  viewProviders: [provideIcons({ heroPlus, heroPencil, heroTrash, heroMagnifyingGlass })]
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
} 