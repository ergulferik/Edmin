import { Component, Input, Output, EventEmitter, signal, computed, Signal } from '@angular/core';
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
import {
 heroPlus,
 heroPencilSquare,
 heroTrash,
 heroMagnifyingGlass,
 heroDocument,
 heroDocumentText,
 heroDocumentDuplicate,
 heroTableCells,
 heroPhoto,
 heroArchiveBox,
 heroCheckCircle,
 heroXCircle,
} from '@ng-icons/heroicons/outline';
import { AppButtonComponent } from '../button/button';
import { Avatar } from '../avatar/avatar';

export interface DataGridColumn {
 key: string;
 label: string;
 type?: 'text' | 'number' | 'date' | 'actions' | 'boolean' | 'file' | 'template' | 'image' | 'avatar';
 width?: string;
 sortable?: boolean;
 data?: any;
 keyExpr?: string;
 displayExpr?: string;
 alternative?: (element: any) => string;
 imageOptions?: {
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: string;
 };
}

export interface DataGridConfig {
 title: string;
 subtitle?: string;
 columns: DataGridColumn[];
 searchableColumns?: string[];
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

/**
 * DataGridComponent is used for displaying data in a table format.
 * Provides customizable columns, actions, and search support.
 */
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
  AppButtonComponent,
  Avatar,
 ],
 templateUrl: './data-grid.html',
 styleUrls: ['./data-grid.scss'],
 viewProviders: [
  provideIcons({
   heroPlus,
   heroPencilSquare,
   heroTrash,
   heroMagnifyingGlass,
   heroDocument,
   heroDocumentText,
   heroDocumentDuplicate,
   heroTableCells,
   heroPhoto,
   heroArchiveBox,
   heroCheckCircle,
   heroXCircle,
  }),
 ],
})
export class DataGridComponent {
 /** DataGrid configuration settings */
 @Input()
 config!: DataGridConfig;
 /** Data to be displayed in the table */
 @Input()
 data: Signal<any[]> = signal<any[]>([]);
 /** Row actions */
 @Input()
 actions?: DataGridAction[];
 /** Loading state */
 @Input()
 loading?: boolean;
 /** Error message */
 @Input()
 error?: string;
 /** Event emitted when the add button is clicked */
 @Output()
 addClick = new EventEmitter<void>();
 /** Event emitted when the search box value changes */
 @Output()
 searchChange = new EventEmitter<string>();

 /** Search term */
 searchTerm = signal<string>('');

 /** Filtered data */
 filteredData = computed(() => {
  const currentData = this.data();
  const currentSearchTerm = this.searchTerm();
  if (!this.config.searchableColumns || this.config.searchableColumns.length < 1) return currentData;

  if (!currentSearchTerm.trim() || !this.config.searchableColumns?.length) {
   return currentData;
  }

  return currentData.filter((item: any) =>
   this.config.searchableColumns!.some(column =>
    item[column]?.toString().toLowerCase().includes(currentSearchTerm.toLowerCase())
   )
  );
 });

 /**
  * Triggered when the search box value changes.
  * @param event Input change event
  */
 onSearchChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.searchTerm.set(value);
  this.searchChange.emit(value);
 }

 /**
  * Triggered when the add button is clicked.
  */
 onAddClick() {
  this.addClick.emit();
 }

 /**
  * Triggered when a row action is clicked.
  * @param action Action
  * @param item Row data
  */
 onActionClick(action: DataGridAction, item: any) {
  action.onClick(item);
 }

 /**
  * Returns the columns to be displayed.
  */
 getDisplayedColumns(): string[] {
  const columns = this.config.columns.map(col => col.key);
  if (this.actions && this.actions.length > 0) {
   columns.push('actions');
  }
  return columns;
 }

 /**
  * Returns the width of a column.
  * @param column Column
  */
 getColumnWidth(column: DataGridColumn): string {
  if (column.type === 'actions') {
   return '120px';
  }
  return column.width || 'auto';
 }

 /**
  * Returns the date in Turkish format.
  * @param date Date string
  */
 formatDate(date: string): string {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('tr-TR', {
   day: '2-digit',
   month: '2-digit',
   year: 'numeric',
  });
 }

 /**
  * Returns the icon according to the file type.
  * @param file File
  */
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

 /**
  * Returns the file name, shortened if necessary.
  * @param file File
  */
 getFileDisplayName(file: File): string {
  if (!file) return 'DOSYA YOK';

  // Show file name with a maximum of 20 characters
  if (file.name.length > 20) {
   const extension = file.name.split('.').pop() || '';
   const name = file.name.substring(0, 17);
   return `${name}...${extension}`;
  }

  return file.name;
 }

 /**
  * Returns the display value for template type columns.
  * @param value Value
  * @param data Data list
  * @param keyExpr Key
  * @param displayExpr Display key
  */
 getTemplateDisplayValue(value: any, data: any, keyExpr?: string, displayExpr?: string): string {
  if (!keyExpr || !displayExpr) return value;
  const template = data.find((item: any) => item[keyExpr] === value);
  return template ? template[displayExpr] : value;
 }

 /**
  * Returns the image source for display.
  * If no image exists or is invalid, it uses the column.alternative function.
  */
 getImageSrc(element: any, column: any): string {
  const value = element[column.key];
  if (value) {
   return value;
  }
  if (typeof column.alternative === 'function') {
   return column.alternative(element);
  }
  // You can return a default image as well
  return '';
 }

 /**
  * Displays an alternative image if the image fails to load.
  */
 onImageError(event: Event, element: any, column: any) {
  const imgElement = event.target as HTMLImageElement;
  if (typeof column.alternative === 'function') {
   imgElement.src = column.alternative(element);
  } else {
   imgElement.src = 'assets/images/avatar-male-blue.png';
  }
 }

 getAvatarSrc(
  element: any,
  column: any
 ): {
  image: string;
  initials: string;
 } {
  const value = element[column.key] || '';
  if (typeof column.alternative === 'function') {
   return {
    image: value,
    initials: column.alternative(element),
   };
  }
  return {
   image: value,
   initials: '?',
  };
 }
}
