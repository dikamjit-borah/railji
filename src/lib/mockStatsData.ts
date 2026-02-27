/**
 * Mock Stats Data Service
 * 
 * Simulates the future API response for user stats.
 * Uses realistic data based on the railji-db.exams.json structure.
 * 
 * When the real API is ready, replace this with actual fetch calls to:
 * - GET /api/v1/stats/user/:userId
 * - GET /api/v1/stats/user/:userId?departmentId=X
 */

import type {
  ExamAttemptRecord,
  StatsDepartment,
  OverviewStats,
  PaperStats,
  ScoreTrendPoint,
  TimeTaken,
} from './statsTypes';

// ============== DEPARTMENTS ==============
export const STATS_DEPARTMENTS: StatsDepartment[] = [
  { id: 'all', name: 'All Departments', icon: '🚂', color: 'from-orange-500 to-orange-600' },
  { id: 'DEPT001', name: 'Civil Engineering', icon: '🏗️', color: 'from-amber-500 to-amber-600' },
  { id: 'DEPT002', name: 'Mechanical (C&W)', icon: '⚙️', color: 'from-blue-500 to-blue-600' },
  { id: 'DEPT003', name: 'Electrical', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
  { id: 'DEPT004', name: 'Commercial (CCTS)', icon: '🎫', color: 'from-green-500 to-green-600' },
  { id: 'DEPT007', name: 'Signal & Telecom', icon: '📡', color: 'from-purple-500 to-purple-600' },
  { id: 'GENERAL', name: 'General / GK', icon: '📚', color: 'from-teal-500 to-teal-600' },
];

// ============== MOCK EXAM ATTEMPTS ==============
// Realistic mock data based on the actual MongoDB records
const MOCK_ATTEMPTS: ExamAttemptRecord[] = [
  // DEPT001 - Civil Engineering
  {
    _id: 'exam_001', examId: 'e001', userId: 'currentUser', paperId: 'paperId1',
    paperName: 'RRC Group D 2023 FULL CE Paper 5', departmentId: 'DEPT001',
    responses: [], totalQuestions: 100, attemptedQuestions: 2, unattemptedQuestions: 98,
    correctAnswers: 2, incorrectAnswers: 0, score: 2, maxScore: 100, percentage: 100,
    accuracy: 100, startTime: '2026-02-10T09:00:00Z', endTime: '2026-02-10T09:12:00Z',
    timeTaken: { hours: 0, minutes: 12, seconds: 0 }, status: 'submitted',
    percentile: 0, isPassed: true, passPercentage: 40, createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-10T09:12:00Z',
  },
  {
    _id: 'exam_002', examId: 'e002', userId: 'currentUser', paperId: 'paperId1',
    paperName: 'RRC Group D 2023 FULL CE Paper 5', departmentId: 'DEPT001',
    responses: [], totalQuestions: 100, attemptedQuestions: 2, unattemptedQuestions: 98,
    correctAnswers: 1, incorrectAnswers: 1, score: 0.67, maxScore: 100, percentage: 33.5,
    accuracy: 50, startTime: '2026-02-11T10:00:00Z', endTime: '2026-02-11T10:05:00Z',
    timeTaken: { hours: 0, minutes: 5, seconds: 0 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-11T10:00:00Z',
    updatedAt: '2026-02-11T10:05:00Z',
  },
  {
    _id: 'exam_003', examId: 'e003', userId: 'currentUser', paperId: 'paper-TtGMhe',
    paperName: 'TEST 4', departmentId: 'DEPT001',
    responses: [], totalQuestions: 30, attemptedQuestions: 3, unattemptedQuestions: 27,
    correctAnswers: 2, incorrectAnswers: 1, score: 1.67, maxScore: 30, percentage: 5.57,
    accuracy: 66.7, startTime: '2026-02-12T11:00:00Z', endTime: '2026-02-12T11:25:00Z',
    timeTaken: { hours: 0, minutes: 25, seconds: 0 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-12T11:00:00Z',
    updatedAt: '2026-02-12T11:25:00Z',
  },
  {
    _id: 'exam_030', examId: 'e030', userId: 'currentUser', paperId: 'paper-zkwbOU',
    paperName: 'Southern Railway JE Works', departmentId: 'DEPT001',
    responses: [], totalQuestions: 110, attemptedQuestions: 50, unattemptedQuestions: 60,
    correctAnswers: 32, incorrectAnswers: 18, score: 25.94, maxScore: 110, percentage: 23.58,
    accuracy: 64, startTime: '2026-02-22T08:00:00Z', endTime: '2026-02-22T08:45:00Z',
    timeTaken: { hours: 0, minutes: 45, seconds: 0 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-22T08:00:00Z',
    updatedAt: '2026-02-22T08:45:00Z',
  },
  {
    _id: 'exam_031', examId: 'e031', userId: 'currentUser', paperId: 'paperId15',
    paperName: 'Time and Distance Mock Test', departmentId: 'DEPT001',
    responses: [], totalQuestions: 30, attemptedQuestions: 3, unattemptedQuestions: 27,
    correctAnswers: 3, incorrectAnswers: 0, score: 3, maxScore: 30, percentage: 10,
    accuracy: 100, startTime: '2026-02-18T14:00:00Z', endTime: '2026-02-18T14:43:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 43 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-18T14:00:00Z',
    updatedAt: '2026-02-18T14:43:00Z',
  },

  // DEPT002 - Mechanical (C&W)
  {
    _id: 'exam_004', examId: 'e004', userId: 'currentUser', paperId: 'paper--KCP8S',
    paperName: 'Air Brake Mock Test-1', departmentId: 'DEPT002',
    responses: [], totalQuestions: 50, attemptedQuestions: 50, unattemptedQuestions: 0,
    correctAnswers: 35, incorrectAnswers: 15, score: 30.05, maxScore: 50, percentage: 60.1,
    accuracy: 70, startTime: '2026-02-13T08:00:00Z', endTime: '2026-02-13T17:03:37Z',
    timeTaken: { hours: 9, minutes: 3, seconds: 37 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-13T08:00:00Z',
    updatedAt: '2026-02-13T17:03:37Z',
  },
  {
    _id: 'exam_005', examId: 'e005', userId: 'currentUser', paperId: 'paper-edTHmI',
    paperName: 'Air Brake Mock Test-5', departmentId: 'DEPT002',
    responses: [], totalQuestions: 50, attemptedQuestions: 3, unattemptedQuestions: 47,
    correctAnswers: 3, incorrectAnswers: 0, score: 3, maxScore: 50, percentage: 6,
    accuracy: 100, startTime: '2026-02-14T09:00:00Z', endTime: '2026-02-14T09:59:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 59 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-14T09:00:00Z',
    updatedAt: '2026-02-14T09:59:00Z',
  },
  {
    _id: 'exam_006', examId: 'e006', userId: 'currentUser', paperId: 'paper-KLQ3o-',
    paperName: 'Disaster Management Mock Test-2', departmentId: 'DEPT002',
    responses: [], totalQuestions: 30, attemptedQuestions: 8, unattemptedQuestions: 22,
    correctAnswers: 7, incorrectAnswers: 1, score: 6.67, maxScore: 30, percentage: 22.23,
    accuracy: 87.5, startTime: '2026-02-15T10:00:00Z', endTime: '2026-02-15T10:28:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 28 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:28:00Z',
  },
  {
    _id: 'exam_007', examId: 'e007', userId: 'currentUser', paperId: 'paper-AM7Sxy',
    paperName: 'Heat Treatment Mock Test-1', departmentId: 'DEPT002',
    responses: [], totalQuestions: 30, attemptedQuestions: 21, unattemptedQuestions: 9,
    correctAnswers: 16, incorrectAnswers: 5, score: 14.35, maxScore: 30, percentage: 47.83,
    accuracy: 76.2, startTime: '2026-02-16T11:00:00Z', endTime: '2026-02-16T11:54:00Z',
    timeTaken: { hours: 0, minutes: 5, seconds: 54 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-16T11:00:00Z',
    updatedAt: '2026-02-16T11:54:00Z',
  },
  {
    _id: 'exam_008', examId: 'e008', userId: 'currentUser', paperId: 'paper-0tgftB',
    paperName: 'Heat Treatment Mock Test-2', departmentId: 'DEPT002',
    responses: [], totalQuestions: 30, attemptedQuestions: 30, unattemptedQuestions: 0,
    correctAnswers: 22, incorrectAnswers: 8, score: 19.36, maxScore: 30, percentage: 64.53,
    accuracy: 73.3, startTime: '2026-02-17T08:00:00Z', endTime: '2026-02-17T08:50:00Z',
    timeTaken: { hours: 0, minutes: 4, seconds: 50 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-17T08:00:00Z',
    updatedAt: '2026-02-17T08:50:00Z',
  },
  {
    _id: 'exam_009', examId: 'e009', userId: 'currentUser', paperId: 'paper-TSbCEn',
    paperName: 'LHB General Mock Test-1', departmentId: 'DEPT002',
    responses: [], totalQuestions: 25, attemptedQuestions: 19, unattemptedQuestions: 6,
    correctAnswers: 19, incorrectAnswers: 0, score: 19, maxScore: 25, percentage: 76,
    accuracy: 100, startTime: '2026-02-19T09:00:00Z', endTime: '2026-02-19T09:28:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 28 }, status: 'submitted',
    percentile: 0, isPassed: true, passPercentage: 70, createdAt: '2026-02-19T09:00:00Z',
    updatedAt: '2026-02-19T09:28:00Z',
  },
  {
    _id: 'exam_010', examId: 'e010', userId: 'currentUser', paperId: 'paper-a_4Md8',
    paperName: 'LHB Coach/Shell Mock Test-1', departmentId: 'DEPT002',
    responses: [], totalQuestions: 15, attemptedQuestions: 7, unattemptedQuestions: 8,
    correctAnswers: 7, incorrectAnswers: 0, score: 7, maxScore: 15, percentage: 46.67,
    accuracy: 100, startTime: '2026-02-20T10:00:00Z', endTime: '2026-02-20T10:34:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 34 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T10:34:00Z',
  },
  {
    _id: 'exam_032', examId: 'e032', userId: 'currentUser', paperId: 'paper-FdwW7F',
    paperName: 'LHB Suspension & Miscellaneous Mock Test-3', departmentId: 'DEPT002',
    responses: [], totalQuestions: 25, attemptedQuestions: 9, unattemptedQuestions: 16,
    correctAnswers: 9, incorrectAnswers: 0, score: 9, maxScore: 25, percentage: 36,
    accuracy: 100, startTime: '2026-02-21T09:00:00Z', endTime: '2026-02-21T09:11:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 11 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-21T09:00:00Z',
    updatedAt: '2026-02-21T09:11:00Z',
  },
  {
    _id: 'exam_033', examId: 'e033', userId: 'currentUser', paperId: 'paper-pIFRBW',
    paperName: 'LHB Suspension & Miscellaneous Mock Test-4', departmentId: 'DEPT002',
    responses: [], totalQuestions: 25, attemptedQuestions: 12, unattemptedQuestions: 13,
    correctAnswers: 10, incorrectAnswers: 2, score: 9.34, maxScore: 25, percentage: 37.36,
    accuracy: 83.3, startTime: '2026-02-21T14:00:00Z', endTime: '2026-02-21T14:58:00Z',
    timeTaken: { hours: 0, minutes: 2, seconds: 58 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-21T14:00:00Z',
    updatedAt: '2026-02-21T14:58:00Z',
  },
  {
    _id: 'exam_034', examId: 'e034', userId: 'currentUser', paperId: 'paper-nLswSv',
    paperName: 'LHB Air Brake System Mock Test-4', departmentId: 'DEPT002',
    responses: [], totalQuestions: 25, attemptedQuestions: 8, unattemptedQuestions: 17,
    correctAnswers: 7, incorrectAnswers: 1, score: 6.67, maxScore: 25, percentage: 26.68,
    accuracy: 87.5, startTime: '2026-02-23T09:00:00Z', endTime: '2026-02-23T09:31:00Z',
    timeTaken: { hours: 0, minutes: 2, seconds: 31 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-23T09:00:00Z',
    updatedAt: '2026-02-23T09:31:00Z',
  },
  {
    _id: 'exam_035', examId: 'e035', userId: 'currentUser', paperId: 'paper-uKY6Mx',
    paperName: 'LHB Air Brake System Mock Test-5', departmentId: 'DEPT002',
    responses: [], totalQuestions: 25, attemptedQuestions: 15, unattemptedQuestions: 10,
    correctAnswers: 15, incorrectAnswers: 0, score: 15, maxScore: 25, percentage: 60,
    accuracy: 100, startTime: '2026-02-24T10:00:00Z', endTime: '2026-02-24T10:22:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 22 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-24T10:00:00Z',
    updatedAt: '2026-02-24T10:22:00Z',
  },

  // DEPT003 - Electrical
  {
    _id: 'exam_011', examId: 'e011', userId: 'currentUser', paperId: 'paper-QWU-Pm',
    paperName: 'Southern Railway JE Electrical Paper', departmentId: 'DEPT003',
    responses: [], totalQuestions: 110, attemptedQuestions: 12, unattemptedQuestions: 98,
    correctAnswers: 4, incorrectAnswers: 8, score: 1.36, maxScore: 110, percentage: 1.24,
    accuracy: 33.3, startTime: '2026-02-18T13:00:00Z', endTime: '2026-02-18T13:43:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 43 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-18T13:00:00Z',
    updatedAt: '2026-02-18T13:43:00Z',
  },
  {
    _id: 'exam_012', examId: 'e012', userId: 'currentUser', paperId: 'paper-QWU-Pm',
    paperName: 'Southern Railway JE Electrical Paper', departmentId: 'DEPT003',
    responses: [], totalQuestions: 110, attemptedQuestions: 7, unattemptedQuestions: 103,
    correctAnswers: 0, incorrectAnswers: 7, score: 0, maxScore: 110, percentage: 0,
    accuracy: 0, startTime: '2026-02-20T14:00:00Z', endTime: '2026-02-20T14:50:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 50 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-02-20T14:50:00Z',
  },

  // DEPT004 - Commercial (CCTS)
  {
    _id: 'exam_013', examId: 'e013', userId: 'currentUser', paperId: 'paperId10',
    paperName: 'SR CCTS 2025', departmentId: 'DEPT004',
    responses: [], totalQuestions: 110, attemptedQuestions: 8, unattemptedQuestions: 102,
    correctAnswers: 4, incorrectAnswers: 4, score: 2.68, maxScore: 110, percentage: 2.44,
    accuracy: 50, startTime: '2026-02-12T14:00:00Z', endTime: '2026-02-12T14:29:00Z',
    timeTaken: { hours: 0, minutes: 3, seconds: 17 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-12T14:00:00Z',
    updatedAt: '2026-02-12T14:29:00Z',
  },
  {
    _id: 'exam_014', examId: 'e014', userId: 'currentUser', paperId: 'paperId10',
    paperName: 'SR CCTS 2025', departmentId: 'DEPT004',
    responses: [], totalQuestions: 110, attemptedQuestions: 6, unattemptedQuestions: 104,
    correctAnswers: 2, incorrectAnswers: 4, score: 0.68, maxScore: 110, percentage: 0.62,
    accuracy: 33.3, startTime: '2026-02-20T16:00:00Z', endTime: '2026-02-20T16:26:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 26 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-20T16:00:00Z',
    updatedAt: '2026-02-20T16:26:00Z',
  },
  {
    _id: 'exam_036', examId: 'e036', userId: 'currentUser', paperId: 'paper-Rm8Ko4',
    paperName: 'Southern Railway CCTS Paper', departmentId: 'DEPT004',
    responses: [], totalQuestions: 110, attemptedQuestions: 1, unattemptedQuestions: 109,
    correctAnswers: 0, incorrectAnswers: 1, score: 0, maxScore: 110, percentage: 0,
    accuracy: 0, startTime: '2026-02-25T10:00:00Z', endTime: '2026-02-25T10:36:00Z',
    timeTaken: { hours: 0, minutes: 8, seconds: 36 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:36:00Z',
  },
  {
    _id: 'exam_037', examId: 'e037', userId: 'currentUser', paperId: 'paper-ZmUF_r',
    paperName: 'Ticket Checking Mock Test-4', departmentId: 'DEPT004',
    responses: [], totalQuestions: 25, attemptedQuestions: 3, unattemptedQuestions: 22,
    correctAnswers: 2, incorrectAnswers: 1, score: 1.67, maxScore: 25, percentage: 6.68,
    accuracy: 66.7, startTime: '2026-02-25T14:00:00Z', endTime: '2026-02-25T14:20:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 20 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-25T14:00:00Z',
    updatedAt: '2026-02-25T14:20:00Z',
  },
  {
    _id: 'exam_038', examId: 'e038', userId: 'currentUser', paperId: 'paper-HR4v2h',
    paperName: 'Ticket Checking Mock Test-1', departmentId: 'DEPT004',
    responses: [], totalQuestions: 25, attemptedQuestions: 13, unattemptedQuestions: 12,
    correctAnswers: 8, incorrectAnswers: 5, score: 6.35, maxScore: 25, percentage: 25.4,
    accuracy: 61.5, startTime: '2026-02-26T08:00:00Z', endTime: '2026-02-26T08:12:00Z',
    timeTaken: { hours: 0, minutes: 12, seconds: 0 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-26T08:00:00Z',
    updatedAt: '2026-02-26T08:12:00Z',
  },

  // DEPT007 - Signal & Telecom
  {
    _id: 'exam_015', examId: 'e015', userId: 'currentUser', paperId: 'paperId11',
    paperName: 'SR JE S&T Signal 2025', departmentId: 'DEPT007',
    responses: [], totalQuestions: 110, attemptedQuestions: 14, unattemptedQuestions: 96,
    correctAnswers: 4, incorrectAnswers: 10, score: 0.70, maxScore: 110, percentage: 0.64,
    accuracy: 28.6, startTime: '2026-02-13T14:00:00Z', endTime: '2026-02-13T14:32:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 32 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-13T14:00:00Z',
    updatedAt: '2026-02-13T14:32:00Z',
  },
  {
    _id: 'exam_016', examId: 'e016', userId: 'currentUser', paperId: 'paperId11',
    paperName: 'SR JE S&T Signal 2025', departmentId: 'DEPT007',
    responses: [], totalQuestions: 110, attemptedQuestions: 7, unattemptedQuestions: 103,
    correctAnswers: 2, incorrectAnswers: 5, score: 0.35, maxScore: 110, percentage: 0.32,
    accuracy: 28.6, startTime: '2026-02-15T15:00:00Z', endTime: '2026-02-15T15:39:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 39 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-15T15:00:00Z',
    updatedAt: '2026-02-15T15:39:00Z',
  },
  {
    _id: 'exam_017', examId: 'e017', userId: 'currentUser', paperId: 'paper-JWVAt6',
    paperName: 'English Mock Test-1', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 30, unattemptedQuestions: 0,
    correctAnswers: 19, incorrectAnswers: 11, score: 15.37, maxScore: 30, percentage: 51.23,
    accuracy: 63.3, startTime: '2026-02-17T13:00:00Z', endTime: '2026-02-17T13:50:40Z',
    timeTaken: { hours: 0, minutes: 50, seconds: 40 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-17T13:00:00Z',
    updatedAt: '2026-02-17T13:50:40Z',
  },
  {
    _id: 'exam_018', examId: 'e018', userId: 'currentUser', paperId: 'paper-3KOsqR',
    paperName: 'Computer Mock Test-3', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 10, unattemptedQuestions: 20,
    correctAnswers: 6, incorrectAnswers: 4, score: 4.68, maxScore: 30, percentage: 15.6,
    accuracy: 60, startTime: '2026-02-18T15:00:00Z', endTime: '2026-02-18T15:03:00Z',
    timeTaken: { hours: 0, minutes: 2, seconds: 3 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-18T15:00:00Z',
    updatedAt: '2026-02-18T15:03:00Z',
  },
  {
    _id: 'exam_019', examId: 'e019', userId: 'currentUser', paperId: 'paper-JWVAt6',
    paperName: 'English Mock Test-1', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 10, unattemptedQuestions: 20,
    correctAnswers: 4, incorrectAnswers: 6, score: 2.02, maxScore: 30, percentage: 6.73,
    accuracy: 40, startTime: '2026-02-19T14:00:00Z', endTime: '2026-02-19T14:08:00Z',
    timeTaken: { hours: 0, minutes: 4, seconds: 8 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-19T14:00:00Z',
    updatedAt: '2026-02-19T14:08:00Z',
  },
  {
    _id: 'exam_020', examId: 'e020', userId: 'currentUser', paperId: 'paper-8_u6qv',
    paperName: 'Rajbhasa Mock Test-1', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 10, unattemptedQuestions: 20,
    correctAnswers: 5, incorrectAnswers: 5, score: 3.35, maxScore: 30, percentage: 11.17,
    accuracy: 50, startTime: '2026-02-21T10:00:00Z', endTime: '2026-02-21T10:16:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 16 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-21T10:00:00Z',
    updatedAt: '2026-02-21T10:16:00Z',
  },
  {
    _id: 'exam_039', examId: 'e039', userId: 'currentUser', paperId: 'paperId16',
    paperName: 'Geometry Mock Test-1', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 4, unattemptedQuestions: 26,
    correctAnswers: 4, incorrectAnswers: 0, score: 4, maxScore: 30, percentage: 13.33,
    accuracy: 100, startTime: '2026-02-23T15:00:00Z', endTime: '2026-02-23T15:13:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 13 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-23T15:00:00Z',
    updatedAt: '2026-02-23T15:13:00Z',
  },
  {
    _id: 'exam_040', examId: 'e040', userId: 'currentUser', paperId: 'paper-0HpMBG',
    paperName: 'Trigonometry Mock Test-1', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 4, unattemptedQuestions: 26,
    correctAnswers: 4, incorrectAnswers: 0, score: 4, maxScore: 30, percentage: 13.33,
    accuracy: 100, startTime: '2026-02-24T14:00:00Z', endTime: '2026-02-24T14:22:00Z',
    timeTaken: { hours: 0, minutes: 5, seconds: 22 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-24T14:00:00Z',
    updatedAt: '2026-02-24T14:22:00Z',
  },
  {
    _id: 'exam_041', examId: 'e041', userId: 'currentUser', paperId: 'paper-ds1DyQ',
    paperName: 'Profit & Loss Mock Test', departmentId: 'DEPT007',
    responses: [], totalQuestions: 30, attemptedQuestions: 5, unattemptedQuestions: 25,
    correctAnswers: 2, incorrectAnswers: 3, score: 1.01, maxScore: 30, percentage: 3.37,
    accuracy: 40, startTime: '2026-02-25T09:00:00Z', endTime: '2026-02-25T09:18:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 18 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 40, createdAt: '2026-02-25T09:00:00Z',
    updatedAt: '2026-02-25T09:18:00Z',
  },

  // GENERAL - General Knowledge
  {
    _id: 'exam_021', examId: 'e021', userId: 'currentUser', paperId: 'paper-La3sb6',
    paperName: 'Computer Mock Test-1', departmentId: 'GENERAL',
    responses: [], totalQuestions: 30, attemptedQuestions: 30, unattemptedQuestions: 0,
    correctAnswers: 28, incorrectAnswers: 2, score: 27.34, maxScore: 30, percentage: 91.13,
    accuracy: 93.3, startTime: '2026-02-22T14:00:00Z', endTime: '2026-02-22T14:59:00Z',
    timeTaken: { hours: 0, minutes: 3, seconds: 59 }, status: 'submitted',
    percentile: 0, isPassed: true, passPercentage: 70, createdAt: '2026-02-22T14:00:00Z',
    updatedAt: '2026-02-22T14:59:00Z',
  },
  {
    _id: 'exam_022', examId: 'e022', userId: 'currentUser', paperId: 'paperId7',
    paperName: 'General Knowledge Mock Test-1', departmentId: 'GENERAL',
    responses: [], totalQuestions: 30, attemptedQuestions: 30, unattemptedQuestions: 0,
    correctAnswers: 20, incorrectAnswers: 10, score: 16.7, maxScore: 30, percentage: 55.67,
    accuracy: 66.7, startTime: '2026-02-19T16:00:00Z', endTime: '2026-02-19T16:59:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 59 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-19T16:00:00Z',
    updatedAt: '2026-02-19T16:59:00Z',
  },
  {
    _id: 'exam_023', examId: 'e023', userId: 'currentUser', paperId: 'paperId7',
    paperName: 'General Knowledge Mock Test-1', departmentId: 'GENERAL',
    responses: [], totalQuestions: 30, attemptedQuestions: 30, unattemptedQuestions: 0,
    correctAnswers: 30, incorrectAnswers: 0, score: 30, maxScore: 30, percentage: 100,
    accuracy: 100, startTime: '2026-02-23T10:00:00Z', endTime: '2026-02-23T10:14:00Z',
    timeTaken: { hours: 0, minutes: 3, seconds: 14 }, status: 'submitted',
    percentile: 0, isPassed: true, passPercentage: 70, createdAt: '2026-02-23T10:00:00Z',
    updatedAt: '2026-02-23T10:14:00Z',
  },
  {
    _id: 'exam_024', examId: 'e024', userId: 'currentUser', paperId: 'paperId7',
    paperName: 'General Knowledge Mock Test-1', departmentId: 'GENERAL',
    responses: [], totalQuestions: 30, attemptedQuestions: 14, unattemptedQuestions: 16,
    correctAnswers: 8, incorrectAnswers: 6, score: 6.02, maxScore: 30, percentage: 20.07,
    accuracy: 57.1, startTime: '2026-02-24T16:00:00Z', endTime: '2026-02-24T16:36:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 36 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-24T16:00:00Z',
    updatedAt: '2026-02-24T16:36:00Z',
  },
  {
    _id: 'exam_042', examId: 'e042', userId: 'currentUser', paperId: 'paper-FUylBA',
    paperName: 'Computer Mock Test-2', departmentId: 'GENERAL',
    responses: [], totalQuestions: 30, attemptedQuestions: 6, unattemptedQuestions: 24,
    correctAnswers: 5, incorrectAnswers: 1, score: 4.67, maxScore: 30, percentage: 15.57,
    accuracy: 83.3, startTime: '2026-02-25T11:00:00Z', endTime: '2026-02-25T11:03:00Z',
    timeTaken: { hours: 0, minutes: 1, seconds: 3 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-25T11:00:00Z',
    updatedAt: '2026-02-25T11:03:00Z',
  },
  {
    _id: 'exam_043', examId: 'e043', userId: 'currentUser', paperId: 'paper-RgHhei',
    paperName: 'Algebra Mock Test-1', departmentId: 'GENERAL',
    responses: [], totalQuestions: 30, attemptedQuestions: 3, unattemptedQuestions: 27,
    correctAnswers: 2, incorrectAnswers: 1, score: 1.67, maxScore: 30, percentage: 5.57,
    accuracy: 66.7, startTime: '2026-02-26T09:00:00Z', endTime: '2026-02-26T09:23:00Z',
    timeTaken: { hours: 0, minutes: 0, seconds: 23 }, status: 'submitted',
    percentile: 0, isPassed: false, passPercentage: 70, createdAt: '2026-02-26T09:00:00Z',
    updatedAt: '2026-02-26T09:23:00Z',
  },
];

// ============== DATA ACCESS FUNCTIONS ==============

/**
 * Get all submitted exam attempts for the current user.
 * Filters by department if specified.
 * 
 * Future API: GET /api/v1/stats/user/:userId/exams?departmentId=X
 */
export function getMockExamAttempts(departmentId?: string): ExamAttemptRecord[] {
  let attempts = MOCK_ATTEMPTS.filter(a => a.status === 'submitted');
  
  if (departmentId && departmentId !== 'all') {
    attempts = attempts.filter(a => a.departmentId === departmentId);
  }
  
  // Sort by date descending (most recent first)
  return attempts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Compute overview stats for filtered attempts.
 * 
 * Future API: GET /api/v1/stats/user/:userId?departmentId=X
 */
export function computeOverviewStats(attempts: ExamAttemptRecord[]): OverviewStats {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0, totalPassed: 0, passRate: 0,
      averageScore: 0, bestScore: 0, averageAccuracy: 0,
      totalTimeSpent: { hours: 0, minutes: 0, seconds: 0 },
      totalCorrect: 0, totalIncorrect: 0, totalUnattempted: 0,
    };
  }

  const totalAttempts = attempts.length;
  const totalPassed = attempts.filter(a => a.isPassed).length;
  const passRate = (totalPassed / totalAttempts) * 100;
  const averageScore = attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts;
  const bestScore = Math.max(...attempts.map(a => a.percentage));
  const averageAccuracy = attempts.reduce((s, a) => s + a.accuracy, 0) / totalAttempts;
  const totalCorrect = attempts.reduce((s, a) => s + a.correctAnswers, 0);
  const totalIncorrect = attempts.reduce((s, a) => s + a.incorrectAnswers, 0);
  const totalUnattempted = attempts.reduce((s, a) => s + a.unattemptedQuestions, 0);

  // Sum up time
  let totalSecs = 0;
  attempts.forEach(a => {
    const t = a.timeTaken;
    totalSecs += t.hours * 3600 + t.minutes * 60 + t.seconds;
  });

  return {
    totalAttempts, totalPassed, passRate,
    averageScore, bestScore, averageAccuracy,
    totalTimeSpent: {
      hours: Math.floor(totalSecs / 3600),
      minutes: Math.floor((totalSecs % 3600) / 60),
      seconds: totalSecs % 60,
    },
    totalCorrect, totalIncorrect, totalUnattempted,
  };
}

/**
 * Group attempts by paper and compute per-paper stats.
 * 
 * Future API: included in GET /api/v1/stats/user/:userId
 */
export function computePaperStats(attempts: ExamAttemptRecord[]): PaperStats[] {
  const paperMap = new Map<string, ExamAttemptRecord[]>();
  
  attempts.forEach(a => {
    const key = `${a.paperId}_${a.departmentId}`;
    if (!paperMap.has(key)) paperMap.set(key, []);
    paperMap.get(key)!.push(a);
  });

  const papers: PaperStats[] = [];
  paperMap.forEach((paperAttempts, key) => {
    const sorted = [...paperAttempts].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const best = sorted.reduce((best, curr) => curr.percentage > best.percentage ? curr : best);
    const avgPct = sorted.reduce((s, a) => s + a.percentage, 0) / sorted.length;

    papers.push({
      paperId: sorted[0].paperId,
      paperName: sorted[0].paperName,
      departmentId: sorted[0].departmentId,
      attempts: sorted,
      bestScore: best.score,
      bestPercentage: best.percentage,
      averagePercentage: avgPct,
      lastAttempted: sorted[sorted.length - 1].createdAt,
      totalAttempts: sorted.length,
      hasPassed: sorted.some(a => a.isPassed),
    });
  });

  // Sort by most recently attempted
  return papers.sort(
    (a, b) => new Date(b.lastAttempted).getTime() - new Date(a.lastAttempted).getTime()
  );
}

/**
 * Build score trend data (chronological attempts with score).
 * 
 * Future API: included in GET /api/v1/stats/user/:userId
 */
export function computeScoreTrend(attempts: ExamAttemptRecord[]): ScoreTrendPoint[] {
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return sorted.map((a, idx) => ({
    attemptIndex: idx + 1,
    percentage: a.percentage,
    paperName: a.paperName,
    date: a.createdAt,
    isPassed: a.isPassed,
  }));
}

/**
 * Format TimeTaken object to readable string.
 */
export function formatTimeTaken(t: TimeTaken): string {
  const parts: string[] = [];
  if (t.hours > 0) parts.push(`${t.hours}h`);
  if (t.minutes > 0) parts.push(`${t.minutes}m`);
  if (t.seconds > 0 || parts.length === 0) parts.push(`${t.seconds}s`);
  return parts.join(' ');
}

/**
 * Get department name by id.
 */
export function getDepartmentName(deptId: string): string {
  const dept = STATS_DEPARTMENTS.find(d => d.id === deptId);
  return dept?.name || deptId;
}

/**
 * Get department color by id.
 */
export function getDepartmentColor(deptId: string): string {
  const dept = STATS_DEPARTMENTS.find(d => d.id === deptId);
  return dept?.color || 'from-stone-500 to-stone-600';
}
