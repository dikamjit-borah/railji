'use client';

import { useRouter } from 'next/navigation';

interface ExamInstructionsProps {
  exam: {
    id: string;
    name: string;
    description: string;
    duration: number;
    totalQuestions: number;
    passingMarks: number;
    passingPercentage?: number;
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
  onStartExam: () => void;
}

export default function ExamInstructions({
  exam,
  questionsLoading,
  questionsPrefetched,
  attemptCount,
  bestScore,
  onStartExam
}: ExamInstructionsProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 lg:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Exam Title Section */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-1">
              {exam.name}
            </h1>
            <p className="text-stone-500 text-sm lg:text-base">
              {exam.description} • {exam.studentsAttempted || (Math.random() * 20 + 5).toFixed(1)}k students took this
            </p>
          </div>

          {/* Prefetch Status Badge */}
          {questionsLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-800">Preparing questions...</span>
            </div>
          )}
          
          {questionsPrefetched && !questionsLoading && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-800">Questions ready • You can start immediately</span>
            </div>
          )}

          {/* Stats Cards - Grid on Large Screens */}
          <div className="grid lg:grid-cols-2 gap-3 lg:gap-3.5 mb-6 lg:mb-8">
            {/* Questions */}
            <div className="flex items-center gap-3 lg:gap-4 bg-white rounded-xl lg:rounded-2xl p-3.5 lg:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg lg:text-xl font-bold text-stone-900">{exam.totalQuestions}</div>
                <div className="text-xs lg:text-sm text-stone-500">Multiple Choice Questions</div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 lg:gap-4 bg-white rounded-xl lg:rounded-2xl p-3.5 lg:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg lg:text-xl font-bold text-stone-900">{exam.duration} mins</div>
                <div className="text-xs lg:text-sm text-stone-500">Total Duration</div>
              </div>
            </div>

            {/* Passing Score */}
            <div className="flex items-center gap-3 lg:gap-4 bg-white rounded-xl lg:rounded-2xl p-3.5 lg:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg lg:text-xl font-bold text-stone-900">40%</div>
                <div className="text-xs lg:text-sm text-stone-500">For Badge / Passing Score</div>
              </div>
            </div>

            {/* Negative Marking */}
            <div className="flex items-center gap-3 lg:gap-4 bg-white rounded-xl lg:rounded-2xl p-3.5 lg:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg lg:text-xl font-bold text-stone-900">-0.33</div>
                <div className="text-xs lg:text-sm text-stone-500">Negative Marking per Wrong Answer</div>
              </div>
            </div>
          </div>

          {/* Attempt History - Show only if user has attempted before */}
          {attemptCount > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 lg:p-6 border border-amber-100 mb-6 lg:mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-lg font-bold text-amber-900">Your Attempt History</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/60 backdrop-blur rounded-xl p-4">
                  <p className="text-xs text-amber-700 mb-1">Total Attempts</p>
                  <p className="text-2xl font-bold text-amber-900">{attemptCount}</p>
                </div>
                {bestScore && (
                  <>
                    <div className="bg-white/60 backdrop-blur rounded-xl p-4">
                      <p className="text-xs text-amber-700 mb-1">Best Score</p>
                      <p className="text-2xl font-bold text-amber-900">{bestScore.score}/{bestScore.totalQuestions}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur rounded-xl p-4">
                      <p className="text-xs text-amber-700 mb-1">Best Percentage</p>
                      <p className="text-2xl font-bold text-amber-900">{bestScore.percentage.toFixed(1)}%</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Important Instructions
            </h2>
            <ul className="space-y-3 text-sm lg:text-base text-stone-600">
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
                    <span>You must complete this test in one session - make sure your internet is reliable.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                    <span>1 mark awarded for a correct answer. Negative marking of -0.33 for each wrong answer.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                    <span>More you give the correct answer more chance to win the badge.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                    <span>If you don&apos;t earn a badge this time, you can retake this test once more.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartExam}
            disabled={questionsLoading}
            className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg hover:shadow-xl transition-all ${
              questionsLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            {questionsLoading ? 'Preparing Questions...' : 'Start Exam'}
          </button>
        </div>
      </main>
    </div>
  );
}
