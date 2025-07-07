import { ExamTemplate, Exam, StudentExamResult, StudentAnswer, CourseStatistics } from '../models/exam.model';

export const EXAM_TEMPLATES_DATA: ExamTemplate[] = [
  {
    id: '1',
    name: 'Numerical Template',
    description: 'Numerical courses template for TYT',
    version: '1.0',
    courseConfigs: [
      { courseId: '1', questionCount: 20, weight: 1.25 },
      { courseId: '2', questionCount: 15, weight: 1.0 },
      { courseId: '3', questionCount: 10, weight: 1.0 }
    ]
  },
  {
    id: '2',
    name: 'Verbal Template',
    description: 'Verbal courses template for TYT',
    version: '1.0',
    courseConfigs: [
      { courseId: '1', questionCount: 20, weight: 1.25 },
      { courseId: '2', questionCount: 15, weight: 1.0 },
      { courseId: '3', questionCount: 10, weight: 1.0 },
      { courseId: '4', questionCount: 10, weight: 1.0 }
    ]
  },
  {
    id: '3',
    name: 'Equal Weight Template',
    description: 'Equal weight courses template for TYT',
    version: '1.0',
    courseConfigs: [
      { courseId: '1', questionCount: 15, weight: 1.0 },
      { courseId: '2', questionCount: 15, weight: 1.0 },
      { courseId: '3', questionCount: 10, weight: 1.0 },
      { courseId: '4', questionCount: 10, weight: 1.0 }
    ]
  }
];

export const EXAMS_DATA: Exam[] = [
  {
    id: '1',
    name: 'TYT June 2024',
    code: 'TYT202406',
    date: new Date('2024-06-15'),
    durationInMinutes: 135,
    templateId: '1',
    answerKeyFileUrl: '/assets/answer-keys/tyt-june-2024.pdf',
    isActive: true
  },
  {
    id: '2',
    name: 'TYT July 2024',
    code: 'TYT202407',
    date: new Date('2024-07-20'),
    durationInMinutes: 135,
    templateId: '2',
    answerKeyFileUrl: '/assets/answer-keys/tyt-july-2024.pdf',
    isActive: true
  },
  {
    id: '3',
    name: 'TYT August 2024',
    code: 'TYT202408',
    date: new Date('2024-08-10'),
    durationInMinutes: 135,
    templateId: '3',
    answerKeyFileUrl: '/assets/answer-keys/tyt-august-2024.pdf',
    isActive: false
  }
];

export const STUDENT_EXAM_RESULTS_DATA: StudentExamResult[] = [
  {
    id: '1',
    studentId: '1',
    examId: '1',
    uploadedAt: new Date('2024-06-15T10:30:00').toISOString(),
    uploadedBy: 'teacher1',
    isConfirmed: true,
    answers: [
      { questionNo: 1, selectedOption: 'A', correctOption: 'A', isCorrect: true, courseId: 'math' },
      { questionNo: 2, selectedOption: 'B', correctOption: 'C', isCorrect: false, courseId: 'math' },
      { questionNo: 3, selectedOption: 'D', correctOption: 'D', isCorrect: true, courseId: 'math' },
      { questionNo: 4, selectedOption: 'A', correctOption: 'A', isCorrect: true, courseId: 'physics' },
      { questionNo: 5, selectedOption: 'E', correctOption: 'B', isCorrect: false, courseId: 'physics' }
    ],
    statistics: [
      { courseId: 'math', correctCount: 15, wrongCount: 5, blankCount: 0, netScore: 13.75, weightedScore: 17.19 },
      { courseId: 'physics', correctCount: 10, wrongCount: 5, blankCount: 0, netScore: 8.75, weightedScore: 8.75 },
      { courseId: 'chemistry', correctCount: 8, wrongCount: 2, blankCount: 0, netScore: 7.5, weightedScore: 7.5 }
    ],
    totalNet: 30.0,
    totalScore: 33.44,
    scoreType: 'Numerical'
  },
  {
    id: '2',
    studentId: '2',
    examId: '1',
    uploadedAt: new Date('2024-06-15T11:15:00').toISOString(),
    uploadedBy: 'teacher1',
    isConfirmed: false,
    answers: [
      { questionNo: 1, selectedOption: 'C', correctOption: 'A', isCorrect: false, courseId: 'math' },
      { questionNo: 2, selectedOption: 'B', correctOption: 'C', isCorrect: false, courseId: 'math' },
      { questionNo: 3, selectedOption: 'D', correctOption: 'D', isCorrect: true, courseId: 'math' },
      { questionNo: 4, selectedOption: 'A', correctOption: 'A', isCorrect: true, courseId: 'physics' },
      { questionNo: 5, selectedOption: 'B', correctOption: 'B', isCorrect: true, courseId: 'physics' }
    ],
    statistics: [
      { courseId: 'math', correctCount: 12, wrongCount: 8, blankCount: 0, netScore: 10.0, weightedScore: 12.5 },
      { courseId: 'physics', correctCount: 12, wrongCount: 3, blankCount: 0, netScore: 11.25, weightedScore: 11.25 },
      { courseId: 'chemistry', correctCount: 9, wrongCount: 1, blankCount: 0, netScore: 8.75, weightedScore: 8.75 }
    ],
    totalNet: 30.0,
    totalScore: 32.5,
    scoreType: 'Numerical'
  }
];
