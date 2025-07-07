import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ClassItem, Field } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare } from '@ng-icons/heroicons/outline';

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
  viewProviders: [provideIcons({ heroPencilSquare })]
})
export class ClassList implements OnInit {
  @Input() classes: ClassItem[] = [];
  @Input() fields: Field[] = [];
  @Input() selectedClass: ClassItem | null = null;
  @Input() selectedField: string = 'all';
  @Input() filteredClasses: ClassItem[] = [];

  @Output() classSelected = new EventEmitter<ClassItem>();
  @Output() dragOver = new EventEmitter<{event: DragEvent, classItem: ClassItem}>();
  @Output() drop = new EventEmitter<{event: DragEvent, classItem: ClassItem}>();
  @Output() addNewClass = new EventEmitter<void>();

  classService = inject(ClassService);
  private router = inject(Router);

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

  // Sınıfları düzenleme sayfasına yönlendirme
  onAddNewClass() {
    this.router.navigate(['/class-definition']);
  }

  // Field bilgisini getir
  getFieldById(id: string): Field {
    return this.fields.find(f => f.id === id)!;
  }

  // Badge class'ını belirle
  getBadgeClass(index: number): string {
    if (this.selectedField === 'all') {
      return index % 2 === 0 ? 'even' : 'odd';
    }
    return 'even';
  }
}
