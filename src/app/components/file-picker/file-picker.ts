import { Component, forwardRef, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
      multi: true
    }
  ]
})
export class FilePickerComponent implements ControlValueAccessor {
  label = input<string>('Dosya seçmek için tıklayın');
  accept = input<string>('*');
  required = input<boolean>(false);

  file: File | null = null;
  disabled = false;
  touched = false;
  isDragOver = false;

  onChange = (file: File | null) => {};
  onTouched = () => {};

  getFileName(): string {
    return this.file?.name || '';
  }

  getFileSize(): string {
    if (!this.file) return '';
    
    const bytes = this.file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.writeValue(file);
    this.onChange(file);
    this.markAsTouched();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

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

  private isFileTypeAccepted(file: File): boolean {
    if (this.accept() === '*') return true;
    
    const acceptedTypes = this.accept().split(',').map(type => type.trim());
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

  removeFile(): void {
    this.writeValue(null);
    this.onChange(null);
    this.markAsTouched();
  }

  writeValue(file: File | null): void {
    this.file = file;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  downloadFile(): void {
    if (!this.file) return;

    // Dosyayı indirmek için URL oluştur
    const url = URL.createObjectURL(this.file);
    
    // İndirme bağlantısı oluştur
    const link = document.createElement('a');
    link.href = url;
    link.download = this.file.name;
    
    // Bağlantıyı tıkla ve temizle
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL'yi temizle
    URL.revokeObjectURL(url);
  }
} 