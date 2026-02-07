/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://railji-business.onrender.com';

export const API_ENDPOINTS = {
  DEPARTMENTS: `${API_BASE_URL}/business/v1/departments`,
  DEPARTMENT: (deptId: string) => `${API_BASE_URL}/business/v1/departments/${deptId}`,
  TOP_PAPERS: `${API_BASE_URL}/business/v1/papers/top`,
  PAPERS: (deptId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}`,
  PAPER_QUESTIONS: (deptId: string, paperId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}/${paperId}`,
  PAPER_ANSWERS: (deptId: string, paperId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}/${paperId}/answers`,
  START_EXAM: `${API_BASE_URL}/business/v1/exams/start`,
  SUBMIT_EXAM: `${API_BASE_URL}/business/v1/exams/submit`,
  EXAM_RESULT: (examId: string) => `${API_BASE_URL}/business/v1/exams/result/${examId}`,
} as const;

export default API_ENDPOINTS;
