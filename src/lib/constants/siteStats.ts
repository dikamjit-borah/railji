/**
 * Centralized site statistics — single source of truth.
 * Update values here and they reflect across all pages and components.
 */
export const SITE_STATS = {
  /** Display string for department count (e.g. "7+") */
  departments: '10+',
  /** Numeric department count for template literals */
  departmentsCount: 10,
  /** Display string for exam paper count */
  examPapers: '100+',
  /** Display string for practice question count */
  practiceQuestions: '10000+',
  /** Numeric practice question count */
  practiceQuestionsCount: 10000,
  /** Number of supported languages */
  languagesSupported: 2,
  /** Display label for bilingual support */
  languageDisplay: 'Bilingual',
  /** Language names */
  languageNames: 'Hindi & English',
  /** Display string for employees promoted */
  employeesPromoted: '1000+',
  /** Numeric employees promoted count (for split rendering) */
  employeesPromotedCount: 1000,
  /** Display string for success rate */
  successRate: '85%',
} as const;
