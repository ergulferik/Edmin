export interface ExamTemplate {
    id: string; // Unique identifier for the exam template
    name: string; // Template name (e.g., TYT Template)
    description?: string; // Optional description for the template
    version?: string; // Optional version for tracking changes
    courseConfigs: ExamTemplateCourseConfig[]; // Array of course-specific configs
  }
  
  export interface ExamTemplateCourseConfig {
    courseId: string; // ID of the course included in the exam
    questionCount: number; // Number of questions for this course
    weight: number; // Weight of this course in score calculation (e.g., 1.25)
  }

  export interface Exam {
    id: string; // Unique identifier for the exam
    name: string; // Name of the exam (e.g., TYT June Exam)
    code: string; // Unique exam code
    date: Date; // Exam date in ISO format (YYYY-MM-DD)
    durationInMinutes?: number; // Duration of the exam in minutes (optional)
    templateId: string; // Reference to the ExamTemplate
    answerKeyFile?: File; // URL or path to the uploaded answer sheet
    isActive: boolean; // Indicates if the exam is currently visible/active
    opticalForm?: File;
  }
  
  export interface StudentExamResult {
    id: string; // Unique identifier for this student exam result
    studentId: string; // ID of the student
    examId: string; // ID of the exam taken
    uploadedAt: string; // ISO timestamp of when the optical form was uploaded
    uploadedBy: string; // ID of the user who uploaded the form
    isConfirmed: boolean; // Indicates if results have been manually reviewed & confirmed
    answers: StudentAnswer[]; // All answers for each question
    statistics: CourseStatistics[]; // Net / correct / incorrect / blank per course
    totalNet: number; // Total net score
    totalScore: number; // Weighted total score
    scoreType?: string; // Score type (e.g., Sayısal, Sözel)
  }
  
  export interface StudentAnswer {
    questionNo: number; // Question number (1-based)
    selectedOption: string | null; // Answer given by student (e.g., 'A', 'B', 'C'), null = blank
    correctOption: string; // Correct answer from answer key
    isCorrect: boolean; // Whether the answer was correct
    courseId: string; // Course to which this question belongs
  }
  
  export interface CourseStatistics {
    courseId: string; // Course ID
    correctCount: number; // Number of correct answers
    wrongCount: number; // Number of wrong answers
    blankCount: number; // Number of unanswered questions
    netScore: number; // Net score = correct - (wrong / 4)
    weightedScore: number; // Net * weight
  }
  