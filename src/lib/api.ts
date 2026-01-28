/**
 * API Service for Rail-Jee Frontend
 * 
 * This module provides functions to interact with the backend APIs.
 * Currently uses mock APIs, will be switched to real APIs in production.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Types
export interface Department {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: string;
  color: {
    gradient: string;
    bg: string;
  };
  paperCount: number;
  materialCount: number;
}

export interface ExamPaper {
  id: string;
  name: string;
  description: string;
  year: string;
  shift: string;
  questions: number;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  rating: number;
  isFree: boolean;
  isNew?: boolean;
  subjects: string[];
  examId: string;
}

export interface Material {
  id: string;
  name: string;
  type: 'notes' | 'book' | 'video' | 'guide';
  description: string;
  downloads: number;
  rating: number;
  isFree: boolean;
  contentType: 'pdf' | 'video';
  contentUrl: string;
}

export interface TopPaper {
  id: string;
  name: string;
  description: string;
  duration: number;
  totalQuestions: number;
  department: string;
}

export interface DepartmentDetail {
  department: {
    id: string;
    name: string;
    fullName: string;
    color: {
      gradient: string;
      bg: string;
    };
  };
  papers: ExamPaper[];
  filters: {
    examTypes: string[];
    subjects: string[];
  };
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingMarks: number;
  passingPercentage: number;
  negativeMarking: number;
  instructions: string[];
  studentsAttempted: number;
}

export interface Question {
  id: number;
  question: {
    en: string;
    hi: string;
  };
  options: {
    en: string[];
    hi: string[];
  };
  correctAnswer: number;
}

export interface ExamQuestionsResponse {
  examId: string;
  questions: Question[];
}

export interface ExamSubmitResult {
  examId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTaken: number;
  attemptNumber: number;
  breakdown: {
    questionId: number;
    userAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    isSkipped: boolean;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Error class
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}

// Helper function for API calls
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.success || !data.data) {
    throw new ApiError(
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.message || 'An unknown error occurred',
      response.status
    );
  }

  return data.data;
}

// API Functions

/**
 * Fetch top 6 exam papers for homepage
 */
export async function getTopPapers(): Promise<TopPaper[]> {
  return fetchApi<TopPaper[]>('/papers/top');
}

/**
 * Fetch all departments
 */
export async function getDepartments(): Promise<Department[]> {
  return fetchApi<Department[]>('/departments');
}

/**
 * Fetch department details by ID
 */
export async function getDepartmentById(
  deptId: string,
  filters?: { examType?: string; subject?: string }
): Promise<DepartmentDetail> {
  const params = new URLSearchParams();
  if (filters?.examType) params.append('examType', filters.examType);
  if (filters?.subject) params.append('subject', filters.subject);
  
  const queryString = params.toString();
  const endpoint = `/departments/${deptId}${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<DepartmentDetail>(endpoint);
}

/**
 * Fetch materials for a specific department
 */
export async function getDepartmentMaterials(deptId: string): Promise<Material[]> {
  return fetchApi<Material[]>(`/departments/${deptId}/materials`);
}

/**
 * Fetch exam details by ID (without questions)
 */
export async function getExamById(examId: string): Promise<Exam> {
  return fetchApi<Exam>(`/exams/${examId}`);
}

/**
 * Fetch questions for an exam
 */
export async function getExamQuestions(examId: string): Promise<ExamQuestionsResponse> {
  return fetchApi<ExamQuestionsResponse>(`/exams/${examId}/questions`);
}

/**
 * Submit exam answers
 */
export async function submitExam(
  examId: string,
  answers: (number | null)[],
  timeTaken: number
): Promise<ExamSubmitResult> {
  return fetchApi<ExamSubmitResult>(`/exams/${examId}/submit`, {
    method: 'POST',
    body: JSON.stringify({
      answers,
      timeTaken,
    }),
  });
}

// Hooks-friendly wrapper functions with loading states

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Create a loading state helper for React components
 */
export function createLoadingState<T>(): UseApiState<T> {
  return {
    data: null,
    loading: true,
    error: null,
  };
}

/**
 * Create a success state helper for React components
 */
export function createSuccessState<T>(data: T): UseApiState<T> {
  return {
    data,
    loading: false,
    error: null,
  };
}

/**
 * Create an error state helper for React components
 */
export function createErrorState<T>(error: ApiError): UseApiState<T> {
  return {
    data: null,
    loading: false,
    error,
  };
}
