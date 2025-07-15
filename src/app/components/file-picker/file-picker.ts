import { Component, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * FilePickerComponent allows users to select, drag-and-drop, and download files. Implements ControlValueAccessor for form integration.
 */
@Component({
  selector: 'edmin-file-picker',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './file-picker.html',
  styleUrls: ['./file-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilePickerComponent),
      multi: true,
    },
  ],
})
export class FilePickerComponent implements ControlValueAccessor {
  /** Label for the file picker */
  label = input<string>('Click to select a file');
  /** Accepted file types */
  accept = input<string>('*');
  /** Is the file required? */
  required = input<boolean>(false);

  /** Selected file */
  file: File | null = null;
  /** Is the picker disabled? */
  disabled = false;
  /** Has the field been touched? */
  touched = false;
  /** Is the drag-over state active? */
  isDragOver = false;

  onChange = (file: File | null) => {
    console.log(file);
  };
  onTouched = () => {};

  /**
   * Returns the selected file's name.
   */
  getFileName(): string {
    return this.file?.name || '';
  }

  /**
   * Returns the selected file's size as a human-readable string.
   */
  getFileSize(): string {
    if (!this.file) return '';

    const bytes = this.file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Handles file selection via input.
   */
  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.writeValue(file);
    this.onChange(file);
    this.markAsTouched();
  }

  /**
   * Handles drag over event.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /**
   * Handles drag leave event.
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  /**
   * Handles file drop event.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0] || null;
    if (file && this.isFileTypeAccepted(file)) {
      this.writeValue(file);
      this.onChange(file);
      this.markAsTouched();
    }
  }

  /**
   * Checks if the file type is accepted.
   */
  private isFileTypeAccepted(file: File): boolean {
    if (this.accept() === '*') return true;

    const acceptedTypes = this.accept()
      .split(',')
      .map(type => type.trim());
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop();

    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        // Extension check
        return type.toLowerCase() === fileExtension.toLowerCase();
      } else if (type.includes('/*')) {
        // Mime type group check (e.g., image/*)
        const [group] = type.split('/');
        return fileType.startsWith(group + '/');
      } else {
        // Exact mime type check
        return type === fileType;
      }
    });
  }

  /**
   * Removes the selected file.
   */
  removeFile(): void {
    this.writeValue(null);
    this.onChange(null);
    this.markAsTouched();
  }

  /**
   * Sets the file value.
   */
  writeValue(file: File | null): void {
    this.file = file;
  }

  /**
   * Registers a change callback.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a touched callback.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Marks the field as touched.
   */
  private markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  /**
   * Downloads the selected file.
   */
  downloadFile(): void {
    if (!this.file) return;

    // Create a URL for the file to download
    const url = URL.createObjectURL(this.file);

    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = this.file.name;

    // Click the link and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the URL
    URL.revokeObjectURL(url);
  }
}
