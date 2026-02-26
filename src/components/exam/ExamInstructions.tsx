'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import UserMenu from '@/components/common/UserMenu';

interface ExamInstructionsProps {
  exam: {
    id: string;
    name: string;
    description: string;
    duration: number;
    totalQuestions: number;
    passingMarks: number;
    passPercentage?: number;
    negativeMarking?: number;
    instructions?: string[];
    studentsAttempted?: number;
  };
  questionsLoading: boolean;
  questionsPrefetched: boolean;
  attemptCount: number;
  bestScore: {
    score: number;
    percentage: number;
    totalQuestions: number;
  } | null;
  onStartExam: (mode: 'exam' | 'practice') => void;
  isStarting?: boolean;
}

export default function ExamInstructions({
  exam,
  questionsLoading,
  questionsPrefetched,
  attemptCount,
  bestScore,
  onStartExam,
  isStarting = false
}: ExamInstructionsProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<'exam' | 'practice' | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {user && <UserMenu user={user} />}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          {/* Exam Title Section */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 mb-1">
              {exam.name}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm lg:text-base">
              {exam.description} • {exam.studentsAttempted || 0} students took this
            </p>
          </div>

          {/* Prefetch Status Badge */}
          {questionsLoading && (
            <div className="mb-4 p-1 sm:p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-800">Preparing questions...</span>
            </div>
          )}
          
          {questionsPrefetched && !questionsLoading && (
            <div className="mb-4 p-1 sm:p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-800">Questions ready • You can start immediately</span>
            </div>
          )}

          {/* Stats Cards - Grid on Large Screens */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
            {/* Questions */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base sm:text-lg lg:text-xl font-bold text-stone-900">{exam.totalQuestions}</div>
                <div className="text-xxs sm:text-xs lg:text-sm text-stone-500">Multiple Choice Questions</div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base sm:text-lg lg:text-xl font-bold text-stone-900">
                  {exam.duration >= 60 
                    ? `${Math.floor(exam.duration / 60)} hr${Math.floor(exam.duration / 60) > 1 ? 's' : ''}${exam.duration % 60 > 0 ? ` ${exam.duration % 60} mins` : ''}`
                    : `${exam.duration} mins`
                  }
                </div>
                <div className="text-xxs sm:text-xs lg:text-sm text-stone-500">Total Duration</div>
              </div>
            </div>

            {/* Passing Score */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base sm:text-lg lg:text-xl font-bold text-stone-900">{exam.passPercentage}%</div>
                <div className="text-xxs sm:text-xs lg:text-sm text-stone-500">For Badge / Passing Score</div>
              </div>
            </div>

            {/* Negative Marking */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base sm:text-lg lg:text-xl font-bold text-stone-900">{exam.negativeMarking}</div>
                <div className="text-xxs sm:text-xs lg:text-sm text-stone-500">Negative Marking per Wrong Answer</div>
              </div>
            </div>
          </div>

          {/* Attempt History - Show only if user has attempted before */}
          {attemptCount > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border border-amber-100 mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-base sm:text-lg font-bold text-amber-900">Your Attempt History</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl p-2 sm:p-4">
                  <p className="text-xxs sm:text-xs text-amber-700 mb-1">Total Attempts</p>
                  <p className="text-lg sm:text-2xl font-bold text-amber-900">{attemptCount}</p>
                </div>
                {bestScore && (
                  <>
                    <div className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl p-2 sm:p-4">
                      <p className="text-xxs sm:text-xs text-amber-700 mb-1">Best Score</p>
                      <p className="text-lg sm:text-2xl font-bold text-amber-900">{bestScore.score}/{bestScore.totalQuestions}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl p-2 sm:p-4">
                      <p className="text-xxs sm:text-xs text-amber-700 mb-1">Best Percentage</p>
                      <p className="text-lg sm:text-2xl font-bold text-amber-900">{bestScore.percentage.toFixed(1)}%</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Important Instructions
            </h2>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base text-stone-600">
              {exam.instructions?.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              )) || (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                    <span>This paper is objective type with one correct answer for each question.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                    <span>1 mark is awarded for each correct answer and 0.33 mark is deducted for each wrong answer.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                    <span>In case of any discrepancy between Hindi and English versions, the English version shall prevail.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                    <span>No marks will be awarded or deducted for unattempted questions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">5</span>
                    <span>Once submitted, an answer cannot be modified.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Mode Selection */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Select Test Mode
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mb-4">Choose how you want to take this test</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Exam Mode */}
              <button
                onClick={() => setSelectedMode('exam')}
                className={`group relative overflow-hidden rounded-xl p-4 sm:p-5 text-left transition-all duration-300 border-2 ${
                  selectedMode === 'exam'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-stone-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedMode === 'exam' ? 'bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedMode === 'exam' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
                      Exam Mode
                      {selectedMode === 'exam' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      Simulate real exam conditions. Answers revealed only after submission.
                    </p>
                  </div>
                </div>
              </button>

              {/* Practice Mode */}
              <button
                onClick={() => setSelectedMode('practice')}
                className={`group relative overflow-hidden rounded-xl p-4 sm:p-5 text-left transition-all duration-300 border-2 ${
                  selectedMode === 'practice'
                    ? 'border-orange-500 bg-orange-50 shadow-lg scale-[1.02]'
                    : 'border-stone-200 bg-white hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedMode === 'practice' ? 'bg-orange-500' : 'bg-orange-100 group-hover:bg-orange-200'
                  }`}>
                    <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedMode === 'practice' ? 'text-white' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
                      Practice Mode
                      {selectedMode === 'practice' && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      Learn as you go. Correct answer shown immediately after each selection.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => selectedMode && onStartExam(selectedMode)}
            disabled={questionsLoading || !selectedMode || isStarting}
            className={`w-full py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r ${
              selectedMode === 'practice' 
                ? 'from-orange-600 to-orange-500' 
                : 'from-blue-600 to-indigo-600'
            } text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all ${
              questionsLoading || !selectedMode || isStarting
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-[1.02] hover:shadow-xl'
            } flex items-center justify-center gap-2`}
          >
            {isStarting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Starting {selectedMode === 'exam' ? 'Exam' : 'Practice'}...</span>
              </>
            ) : questionsLoading ? (
              'Preparing Questions...'
            ) : !selectedMode ? (
              'Select a Mode to Continue'
            ) : (
              `Start ${selectedMode === 'exam' ? 'Exam' : 'Practice'}`
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
