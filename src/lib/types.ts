/**
 * Shared Types
 * Centralized type definitions for the application
 */

// ============== Bilingual Content ==============
export interface BilingualText {
  en: string;
  hi: string;
}

// ============== Question Types ==============
export interface Question {
  id: number;
  question: BilingualText;
  options: BilingualText[];
  details?: BilingualText[];
  correctAnswer?: number;
}

// ============== Exam/Paper Types ==============
export interface ExamPaper {
  id: string;
  paperId?: string;
  departmentId?: string;
  name: string;
  description: string;
  year: string | number;
  shift: string;
  questions: number;
  duration: number;
  usersAttempted?: number;
  rating?: number;
  isFree: boolean;
  isNew?: boolean;
  subjects?: string[];
  examId: string;
  paperCode?: string;
  type?: string;
  paperType?: string;
  zones?: string;
  examType?: string;
  totalQuestions?: number;
  passMarks?: number;
  negativeMarking?: number;
}

export interface Exam {
  id: string;
  departmentId?: string;
  paperId?: string;
  name: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingMarks: number;
  passPercentage?: number;
  negativeMarking?: number;
  instructions?: string[];
  studentsAttempted?: number;
}

// ============== Department Types ==============
export interface DepartmentColor {
  gradient: string;
  bg: string;
}

export interface DepartmentInfo {
  id: string;
  departmentId?: string;
  slug?: string;
  name: string;
  fullName: string;
  description?: string;
  icon?: string;
  color: DepartmentColor;
  paperCount?: number;
  materialCount?: number;
}

export interface DepartmentData {
  department: DepartmentInfo;
  papers: ExamPaper[];
  filters: {
    examTypes: string[];
    subjects: string[];
  };
}

// ============== Material Types ==============
export interface Material {
  _id: string;
  materialId: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'book' | 'guide';
  departmentId: string;
  url: string;
  thumbnailUrl: string;
  duration: number | null;
  fileSize: number;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============== API Response Types ==============
export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  timestamp?: string;
  path?: string;
}

export interface PapersApiResponse {
  papers: ExamPaper[];
  metadata?: {
    paperCodes?: {
      general: string[];
      nonGeneral: string[];
    };
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QuestionsApiResponse {
  _id: string;
  paperId: string;
  departmentId: string;
  paperCode: string;
  questions: Question[];
  flaggedQuestions?: Array<{ id: number; count: number }>;
  createdAt?: string;
  updatedAt?: string;
}

// ============== Exam Result Types ==============
export interface ExamResult {
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  percentage: number;
  timeTaken: number;
  completedAt: string;
}
