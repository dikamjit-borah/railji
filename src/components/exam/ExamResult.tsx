'use client';

import { useRouter } from 'next/navigation';

interface Question {
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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-teal-50/30 to-stone-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-stone-100 rounded-xl transition-all"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-bold text-stone-800">Exam Completed</h1>
                <p className="text-xs text-stone-500">{exam.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Result Badge */}
          <div className={`rounded-3xl p-8 text-center mb-6 ${
            passed
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
          } text-white shadow-xl`}>
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              {passed ? (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {passed
                ? 'You passed the exam successfully'
                : 'You need to score at least 40% to pass'}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div>
                <p className="text-5xl font-bold mb-1">{score.toFixed(2)}</p>
                <p className="text-white/80 text-sm">Your Score</p>
              </div>
              <div className="w-px h-16 bg-white/30"></div>
              <div>
                <p className="text-5xl font-bold mb-1">{percentage.toFixed(1)}%</p>
                <p className="text-white/80 text-sm">Percentage</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-800">{correctAnswers}</p>
                  <p className="text-sm text-stone-500">Correct Answers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-800">{wrongAnswers}</p>
                  <p className="text-sm text-stone-500">Wrong Answers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-800">{skipped}</p>
                  <p className="text-sm text-stone-500">Skipped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Exam Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Total Questions</p>
                  <p className="font-bold text-stone-800">{questions.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Time Taken</p>
                  <p className="font-bold text-stone-800">{minutesTaken}m {secondsTaken}s</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Answered</p>
                  <p className="font-bold text-stone-800">{answers.filter(a => a !== null).length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Negative Marking</p>
                  <p className="font-bold text-stone-800">-0.33 per wrong</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReviewAnswers}
              className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Review Answers
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-4 bg-white border-2 border-stone-300 text-stone-700 rounded-2xl font-semibold text-lg hover:bg-stone-100 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
