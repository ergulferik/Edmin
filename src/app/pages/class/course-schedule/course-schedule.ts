import { Component, effect, inject } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { CalendarModule, CalendarWeekModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent, ModalFormConfig } from '../../../components/modal/modal-form/modal-form';
import { CourseService } from '../../../services/course.service';
import { TeacherService } from '../../../services/teacher.service';
import { CourseSchedule as CourseScheduleModel } from '../../../models/class.model';
import { ClassService } from '../../../services/class.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../components/page/page-header/page-header';

// CalendarEvent'e classId ve teacherId ekleyen bir arayüz tanımla
interface ScheduleCalendarEvent extends CalendarEvent {
 classId: string;
 teacherId: string;
}
/**
 *  Course Schedule Page
 *  This page is used to manage the course schedule for a class
 *  It uses the angular-calendar library to display the calendar and the events
 *  It uses the modal-form component to add and edit the events
 *  It uses the class-service to get the class schedule
 *  It uses the course-service to get the courses
 *  It uses the teacher-service to get the teachers
 */
@Component({
 selector: 'app-course-schedule',
 templateUrl: './course-schedule.html',
 styleUrl: './course-schedule.scss',
 standalone: true,
 imports: [
  CommonModule,
  CalendarModule,
  CalendarWeekModule,
  FormsModule,
  ReactiveFormsModule,
  MatOptionModule,
  MatSelectModule,
  PageHeaderComponent,
 ],
})
export class CourseSchedule {
 viewDate: Date = new Date();
 dayIndex = this.viewDate.getDay();

 TIME_PERIOD = 6;
 DAY_START_HOUR = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 8, 0);
 DAY_END_HOUR = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 20, 0);

 selectedStart: Date | null = null;
 dialog = inject(MatDialog);
 courseService = inject(CourseService);
 teacherService = inject(TeacherService);
 classService = inject(ClassService);
 events: ScheduleCalendarEvent[] = [];
 allEvents: ScheduleCalendarEvent[] = [];

 modalFormConfig: ModalFormConfig = {
  title: 'Ders Ekle',
  fields: [
   {
    key: 'courseId',
    label: 'Ders',
    type: 'select',
    options: this.courseService.courses().map(course => ({
     value: course.id,
     label: course.name,
    })),
   },
   {
    key: 'teacherId',
    label: 'Öğretmen',
    type: 'select',
    options: this.teacherService.teachers().map(teacher => ({
     value: teacher.id,
     label: `${teacher.name} ${teacher.surname}`,
    })),
   },
   {
    key: 'start',
    label: 'Başlangıç',
    type: 'time',
    timeOptions: {
     min: `${this.DAY_START_HOUR.getHours()}:${this.DAY_START_HOUR.getMinutes()}`,
     max: `${this.DAY_END_HOUR.getHours()}:${this.DAY_END_HOUR.getMinutes()}`,
     interval: `${60 / this.TIME_PERIOD}min`,
    },
   },
   {
    key: 'end',
    label: 'Bitiş',
    type: 'time',
    timeOptions: {
     min: `${this.DAY_START_HOUR.getHours()}:${this.DAY_START_HOUR.getMinutes()}`,
     max: `${this.DAY_END_HOUR.getHours()}:${this.DAY_END_HOUR.getMinutes()}`,
     interval: `${60 / this.TIME_PERIOD}min`,
    },
   },
   {
    key: 'description',
    label: 'Açıklama',
    type: 'textarea',
   },
  ],
 };

 refresh = new Subject<void>();

 listClass: { id: string; name: string }[] = [];
 listTeacher: { id: string; name: string }[] = [];
 selectedClassId: string | null = null;
 selectedTeacherId: string | null = null;

 constructor() {
  this.listClass = this.classService.classes().map(cls => ({ id: cls.id, name: cls.name }));
  this.selectedClassId = this.classService.selectedClass()?.id || null;
  this.selectedTeacherId = this.teacherService.selectedTeacher()?.id || null;
  this.listTeacher = this.teacherService
   .teachers()
   .map(teacher => ({ id: teacher.id, name: `${teacher.name} ${teacher.surname}` }));
  this.classService.getClasSchedule(this.classService.selectedClass()?.id || '');
  effect(() => {
   this.prepareAllEvents();
   this.updateEvents();
  });
 }

 prepareAllEvents(): void {
  // Haftanın başlangıcı (Pazartesi)
  const weekStart = new Date(this.viewDate);
  const currentDay = weekStart.getDay();
  const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
  weekStart.setDate(weekStart.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  this.allEvents = this.classService.classSchedule().map(event => {
   // event.start bir Date nesnesi olsa da burada sadece gün ve saat bilgisi önemli
   const dayOfWeek = event.start.getDay(); // 0: Pazar, 1: Pazartesi, ...
   const eventDate = new Date(weekStart);

   // Eğer Pazar ise haftanın son günü olarak 6. güne al
   const targetDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
   eventDate.setDate(weekStart.getDate() + targetDay);
   eventDate.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);

   const eventEndDate = new Date(eventDate);
   eventEndDate.setHours(event.end.getHours(), event.end.getMinutes(), 0, 0);

   return {
    ...event,
    title: this.getEventTitle(event),
    color: { primary: 'var(--calendar-primary)', secondary: 'var(--calendar-secondary)' },
    draggable: true,
    resizable: {
     beforeStart: true,
     afterEnd: true,
    },
    start: eventDate,
    end: eventEndDate,
    meta: {
     id: event.id,
     teacherId: event.teacherId,
     classId: event.classId,
     description: event.description,
    },
   };
  });
 }

 updateEvents(): void {
  let filtered = this.allEvents;
  if (this.selectedClassId) {
   filtered = filtered.filter(event => event.meta.classId === this.selectedClassId);
  }
  if (this.selectedTeacherId) {
   filtered = filtered.filter(event => event.meta.teacherId === this.selectedTeacherId);
  }
  this.events = filtered;
  this.refresh.next();
 }

 async courseScheduleTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): Promise<void> {
  await this.classService.updateCourseScheduleCourse(event.meta.id as string, {
   start: newStart,
   end: newEnd,
  });
  this.refresh.next();
 }

 updateCourseSchedule(event: CalendarEvent): void {
  this.modalFormConfig.title = 'Ders Düzenle';
  this.modalFormConfig.fields[0].value = event.meta.courseId;
  this.modalFormConfig.fields[1].value = event.meta.teacherId;
  this.modalFormConfig.fields[2].value = event.start;
  this.modalFormConfig.fields[3].value = event.end;
  this.modalFormConfig.fields[4].value = event.meta.description;

  const dialogRef = this.dialog.open(ModalFormComponent, {
   data: {
    config: this.modalFormConfig,
   },
  });

  dialogRef.afterClosed().subscribe(async result => {
   if (result) {
    await this.classService.updateCourseScheduleCourse(event.meta.id as string, result as CourseScheduleModel);
    this.refresh.next();
    event.title = this.getEventTitle(result as CourseScheduleModel);
   }
  });
 }

 addCourseSchedule(event: { date: Date }): void {
  if (!this.selectedStart) {
   this.selectedStart = event.date;
  } else {
   const start = this.selectedStart < event.date ? this.selectedStart : event.date;
   const end = this.selectedStart > event.date ? this.selectedStart : event.date;
   const newEvent: ScheduleCalendarEvent = {
    start,
    end: end,
    title: 'Yeni Ders',
    color: { primary: 'var(--calendar-primary)', secondary: 'var(--calendar-secondary)' },
    draggable: true,
    resizable: { beforeStart: true, afterEnd: true },
    classId: this.selectedClassId || '',
    teacherId: this.selectedTeacherId || '',
   };
   this.events = [...this.events, newEvent];
   this.selectedStart = null;
   this.refresh.next();

   this.modalFormConfig.fields[0].value = '';
   this.modalFormConfig.fields[1].value = '';
   this.modalFormConfig.fields[2].value = start;
   this.modalFormConfig.fields[3].value = end;
   this.modalFormConfig.fields[4].value = '';

   const dialogRef = this.dialog.open(ModalFormComponent, {
    data: {
     config: this.modalFormConfig,
    },
   });

   dialogRef.afterClosed().subscribe(async result => {
    if (result) {
     await this.classService.createCourseScheduleCourse({
      ...result,
      classId: this.selectedClassId,
     } as CourseScheduleModel);
    } else {
     this.events.pop();
     this.refresh.next();
    }
   });
  }
 }

 onClassChange(classId: string): void {
  const foundedClass = this.classService.classes().find(c => c.id === classId);
  if (foundedClass) {
   this.selectedClassId = classId;
   this.classService.getClasSchedule(classId);
   this.classService.selectedClass.update(() => foundedClass);
  }
  this.updateEvents();
 }

 onTeacherChange(teacherId: string): void {
  this.selectedTeacherId = teacherId;
  this.updateEvents();
 }

 getEventTitle(event: CourseScheduleModel): string {
  return `<div class="course-name"> ${this.courseService.courses().find(course => course.id === event.courseId)?.name} </div> <div class="teacher-name"> ${this.teacherService.teachers().find(teacher => teacher.id === event.teacherId)?.name} ${this.teacherService.teachers().find(teacher => teacher.id === event.teacherId)?.surname} </div>
     <div class="time"> ${event.start.getHours().toString().padStart(2, '0')}:${event.start.getMinutes().toString().padStart(2, '0')} - ${event.end.getHours().toString().padStart(2, '0')}:${event.end.getMinutes().toString().padStart(2, '0')} </div>
     <div class="description"> Açıklama: ${event.description || ''} </div>`;
 }

 beforeViewRender(): void {
  setTimeout(() => {
   const timeLabelColumn = document.querySelector('.cal-time-label-column');
   if (timeLabelColumn) {
    const step = 60 / this.TIME_PERIOD;
    let labelIndex = 0;
    Array.from(timeLabelColumn.children).forEach((row: Element) => {
     Array.from(row.children).forEach((label: Element) => {
      const totalMinutes = labelIndex * step;
      const hour = this.DAY_START_HOUR.getHours() + Math.floor(totalMinutes / 60);
      const minute = Math.round(totalMinutes % 60);

      const now = this.viewDate;
      const labelTime = new Date(now);
      labelTime.setHours(hour, minute, 0, 0);

      // Sonraki label'ın zamanı (bir sonraki aralığın başlangıcı)
      const nextTotalMinutes = (labelIndex + 1) * step;
      const nextHour = this.DAY_START_HOUR.getHours() + Math.floor(nextTotalMinutes / 60);
      const nextMinute = Math.round(nextTotalMinutes % 60);
      const nextLabelTime = new Date(now);
      nextLabelTime.setHours(nextHour, nextMinute, 0, 0);

      // viewDate bu aralıktaysa class ekle
      if (now >= labelTime && now < nextLabelTime) {
       label.classList.add('current-time-label');
      } else {
       label.classList.remove('current-time-label');
      }

      const calTime = label.querySelector('.cal-time');
      if (calTime) {
       calTime.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      }
      labelIndex++;
     });
    });
   }
  }, 1000);
 }
}
