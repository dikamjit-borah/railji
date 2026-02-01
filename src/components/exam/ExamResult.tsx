'use client';

import { useRouter } from 'next/navigation';
import { Question } from '@/lib/types';

interface ExamResultProps {
  exam: {
    id: string;
    name: string;
  };
  questions: Question[];
  answers: (number | null)[];
  score: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTaken: number; // in seconds
  onReviewAnswers: () => void;
}

export default function ExamResult({
  exam,
  questions,
  answers,
  score,
  percentage,
  passed,
  correctAnswers,
  wrongAnswers,
  skipped,
  timeTaken,
  onReviewAnswers
}: ExamResultProps) {
  const router = useRouter();

  const minutesTaken = Math.floor(timeTaken / 60);
  const secondsTaken = timeTaken % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-orange-50/30 to-stone-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-1.5 sm:p-2 hover:bg-stone-100 rounded-lg sm:rounded-xl transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <div>
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-stone-800">Exam Completed</h1>
                <p className="text-xxs sm:text-xs text-stone-500">{exam.name}</p>
              </div>
            </div>
            <img
              src="/images/logo.png"
              alt="RailJee Logo"
              className="h-8 sm:h-10 lg:h-12 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-5 lg:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Result Badge */}
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-center mb-4 sm:mb-5 lg:mb-6 ${
            passed
              ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
          } text-white shadow-lg`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              {passed ? (
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm">
              {passed
                ? 'You passed the exam successfully'
                : 'You need to score at least 40% to pass'}
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{score.toFixed(2)}</p>
                <p className="text-white/80 text-xxs sm:text-xs">Your Score</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-white/30"></div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{Math.max(0, percentage).toFixed(1)}%</p>
                <p className="text-white/80 text-xxs sm:text-xs">Percentage</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800">{correctAnswers}</p>
                  <p className="text-xs sm:text-sm text-stone-500">Correct</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800">{wrongAnswers}</p>
                  <p className="text-xs sm:text-sm text-stone-500">Wrong</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800">{skipped}</p>
                  <p className="text-xs sm:text-sm text-stone-500">Skipped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-stone-100 mb-4 sm:mb-5 lg:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-stone-800 mb-3 sm:mb-4">Exam Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-stone-500">Total Questions</p>
                  <p className="font-bold text-stone-800 text-sm sm:text-base">{questions.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-stone-500">Time Taken</p>
                  <p className="font-bold text-stone-800 text-sm sm:text-base">{minutesTaken}m {secondsTaken}s</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-stone-500">Attempted</p>
                  <p className="font-bold text-stone-800 text-sm sm:text-base">{answers.filter(a => a !== null).length}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-stone-500">Negative Marking</p>
                  <p className="font-bold text-stone-800 text-sm sm:text-base">-0.33 per wrong</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <button
              onClick={onReviewAnswers}
              className="flex-1 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Review Answers
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 sm:py-3.5 lg:py-4 bg-white border-2 border-stone-300 text-stone-700 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-stone-100 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
