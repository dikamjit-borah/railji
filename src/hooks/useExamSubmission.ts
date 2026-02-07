'use client';

import { useCallback } from 'react';
import { Question, ExamResult } from '@/lib/types';
import { SubmissionResult, QuestionResult, MarkingScheme, UseExamSubmissionProps, UseExamSubmissionReturn } from '@/lib/examTypes';

const STORAGE_KEY_PREFIX = 'exam_result_';

/**
 * Hook to handle exam submission and scoring logic
 */
export function useExamSubmission({
  examId,
  examTitle,
  initialTime,
  markingScheme
}: UseExamSubmissionProps): UseExamSubmissionReturn {

  // Calculate exam results
  const calculateResult = useCallback((
    questions: Question[],
    answers: (number | null)[],
    timeRemaining: number
  ): SubmissionResult => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const questionResults: QuestionResult[] = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isSkipped = userAnswer === null;
      const isCorrect = !isSkipped && userAnswer === question.correctAnswer;

      if (isSkipped) {
        skipped++;
      } else if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }

      questionResults.push({
        questionIndex: index,
        userAnswer,
        correctAnswer: question.correctAnswer ?? -1,
        isCorrect,
        isSkipped
      });
    });

    // Calculate score using marking scheme
    const score = 
      (correct * markingScheme.correct) +
      (wrong * markingScheme.incorrect) +
      (skipped * markingScheme.unattempted);

    const totalQuestions = questions.length;
    const maxScore = totalQuestions * markingScheme.correct;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const timeTaken = initialTime - timeRemaining;

    return {
      score: Math.max(0, score), // Ensure score doesn't go negative
      totalQuestions,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skippedQuestions: skipped,
      percentage: Math.max(0, percentage),
      timeTaken,
      questionResults
    };
  }, [markingScheme, initialTime]);

  // Save result to session storage
  const saveResultToStorage = useCallback((result: SubmissionResult) => {
    try {
      const storageData: ExamResult = {
        examId,
        examTitle,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        skippedQuestions: result.skippedQuestions,
        percentage: result.percentage,
        timeTaken: result.timeTaken,
        completedAt: new Date().toISOString()
      };

      sessionStorage.setItem(
        `${STORAGE_KEY_PREFIX}${examId}`,
        JSON.stringify(storageData)
      );
    } catch (error) {
      console.error('Failed to save exam result:', error);
    }
  }, [examId, examTitle]);

  // Get stored result
  const getStoredResult = useCallback((): SubmissionResult | null => {
    try {
      const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${examId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to retrieve stored result:', error);
    }
    return null;
  }, [examId]);

  return {
    calculateResult,
    saveResultToStorage,
    getStoredResult
  };
}

// Note: formatTimeDuration and getGrade moved to @/lib/examUtils
