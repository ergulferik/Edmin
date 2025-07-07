import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ExamTemplateListComponent } from '../../components/exam-template-list/exam-template-list';
import { ExamTemplate } from '../../models/exam.model';

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.html',
  styleUrls: ['./exam-create.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class ExamCreatePage implements OnInit {
  examForm: FormGroup;
  selectedTemplate: ExamTemplate | null = null;
  opticalForm: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      examDate: ['', Validators.required],
      examCode: ['', Validators.required],
      examName: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  openTemplateSelection(): void {
    const dialogRef = this.dialog.open(ExamTemplateListComponent, {
      width: '800px',
      height: '600px',
      panelClass: 'template-dialog',
      data: {
        selectable: true,
        viewMode: 'show',
        select: (template: ExamTemplate) => {
          this.selectedTemplate = template;
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedTemplate = result;
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.opticalForm = input.files[0];
    }
  }

  createExam(): void {
    if (this.examForm.valid && this.selectedTemplate) {
      const examData = {
        ...this.examForm.value,
        templateId: this.selectedTemplate.id,
        opticalForm: this.opticalForm
      };
      console.log('Creating exam with data:', examData);
      // TODO: Implement exam creation logic
    }
  }

  cancel(): void {
    this.router.navigate(['/exams']);
  }
} 