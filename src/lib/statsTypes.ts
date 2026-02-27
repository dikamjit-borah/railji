/**
 * Stats Page Types
 * Types for the user statistics module
 * 
 * Future API Endpoints:
 * GET /api/v1/stats/user/:userId                    → UserStatsResponse (overall stats)
 * GET /api/v1/stats/user/:userId?departmentId=X     → UserStatsResponse (department-filtered)
 * GET /api/v1/stats/user/:userId/exams              → ExamAttemptRecord[] (all attempts)
 * GET /api/v1/stats/user/:userId/exams?dept=X       → ExamAttemptRecord[] (filtered)
 * GET /api/v1/stats/user/:userId/summary             → DepartmentSummary[] (per-dept breakdown)
 */

// ============== Exam Attempt Record (from MongoDB) ==============
export interface ExamAttemptRecord {
  _id: string;
  examId: string;
  userId: string;
  paperId: string;
  paperName: string;
  departmentId: string;
  responses: Array<{
    questionId: number;
    selectedOption: number;
    isFlagged: boolean;
  }>;
  totalQuestions: number;
  attemptedQuestions: number;
  unattemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  startTime: string;
  endTime?: string;
  timeTaken: TimeTaken;
  status: 'in-progress' | 'submitted';
  percentile: number;
  isPassed: boolean;
  passingScore?: number;
  passPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimeTaken {
  hours: number;
  minutes: number;
  seconds: number;
}

// ============== Department Info ==============
export interface StatsDepartment {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// ============== Aggregated Stats ==============
export interface OverviewStats {
  totalAttempts: number;
  totalPassed: number;
  passRate: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
  totalTimeSpent: TimeTaken;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
}

// ============== Paper-wise Grouping ==============
export interface PaperStats {
  paperId: string;
  paperName: string;
  departmentId: string;
  attempts: ExamAttemptRecord[];
  bestScore: number;
  bestPercentage: number;
  averagePercentage: number;
  lastAttempted: string;
  totalAttempts: number;
  hasPassed: boolean;
}

// ============== Score Trend Point ==============
export interface ScoreTrendPoint {
  attemptIndex: number;
  percentage: number;
  paperName: string;
  date: string;
  isPassed: boolean;
}

// ============== API Response Shape ==============
export interface UserStatsResponse {
  success: boolean;
  data: {
    overview: OverviewStats;
    departments: StatsDepartment[];
    papers: PaperStats[];
    recentAttempts: ExamAttemptRecord[];
    scoreTrend: ScoreTrendPoint[];
  };
}
