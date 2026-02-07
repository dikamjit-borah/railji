'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { Question, BilingualText } from '@/lib/types';
import LoadingState from './common/LoadingState';
import ErrorScreen from './common/ErrorScreen';
import QuestionReview from './QuestionReview';
import Navbar from './common/Navbar';

interface ExamResultData {
  _id: string;
  examId: string;
  userId: string;
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
  endTime: string;
  timeTaken: number;
  status: string;
  percentile: number;
  isPassed: boolean;
  passingScore: number;
}

interface ExamResultClientProps {
  examId: string;
}

export default function ExamResultClient({ examId }: ExamResultClientProps) {
  const router = useRouter();
  const [resultData, setResultData] = useState<ExamResultData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionReview, setShowQuestionReview] = useState(false);

  useEffect(() => {
    async function fetchExamResult() {
      try {
        setLoading(true);
        setError(null);

        // Fetch exam result
        const response = await fetch(API_ENDPOINTS.EXAM_RESULT(examId));
        if (!response.ok) {
          throw new Error('Failed to fetch exam results');
        }

        const data = await response.json();
        if (!data.success || !data.data) {
          throw new Error('Invalid response from server');
        }

        setResultData(data.data);

        // Fetch questions and answers using paperId and departmentId from result
        const { paperId, departmentId } = data.data;
        
        if (departmentId && paperId) {
          try {
            // Fetch both questions and answers in parallel
            const [questionsResponse, answersResponse] = await Promise.all([
              fetch(API_ENDPOINTS.PAPER_QUESTIONS(departmentId, paperId)),
              fetch(API_ENDPOINTS.PAPER_ANSWERS(departmentId, paperId))
            ]);
            
            if (questionsResponse.ok && answersResponse.ok) {
              const questionsData = await questionsResponse.json();
              const answersData = await answersResponse.json();
              
              if (questionsData.success && questionsData.data?.questions) {
                // Create a map of correct answers from answers API
                const correctAnswersMap = new Map<number, number>();
                
                if (answersData.success && answersData.data?.answers && Array.isArray(answersData.data.answers)) {
                  // Answers are in data.answers array
                  answersData.data.answers.forEach((ans: any) => {
                    correctAnswersMap.set(ans.questionId || ans.id, ans.correct || ans.answer);
                  });
                }
                // Map questions and merge with correct answers from answers API
                const transformedQuestions = questionsData.data.questions.map((q: any) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  details: q.details || [],
                  correctAnswer: correctAnswersMap.get(q.id) ?? q.correctAnswer
                }));
                setQuestions(transformedQuestions);
                console.log('Fetched questions and answers successfully:', transformedQuestions);
              }
            }
          } catch (err) {
            console.error('Error fetching questions or answers:', err);
            // Questions are optional for review
          }
        }
        
      } catch (err) {
        console.error('Error fetching exam result:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exam results');
      } finally {
        setLoading(false);
      }
    }

    fetchExamResult();
  }, [examId]);

  // Convert responses to answers array mapped to questions
  const getAnswersArray = (): (number | null)[] => {
    if (!resultData || !questions.length) return [];
    
    const answersMap = new Map(
      resultData.responses.map(r => [r.questionId, r.selectedOption])
    );
    
    return questions.map(q => {
      const selected = answersMap.get(q.id);
      return selected !== undefined && selected !== -1 ? selected : null;
    });
  };

  // Convert responses to marked for review array mapped to questions
  const getMarkedForReview = (): boolean[] => {
    if (!resultData || !questions.length) return [];
    
    const markedMap = new Map(
      resultData.responses.map(r => [r.questionId, r.isFlagged])
    );
    
    return questions.map(q => markedMap.get(q.id) || false);
  };

  if (loading) {
    return <LoadingState message="Loading exam results..." />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Error Loading Results"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!resultData) {
    return (
      <ErrorScreen
        title="Results Not Found"
        message="The exam results you're looking for don't exist."
        onRetry={undefined}
      />
    );
  }

  // Show question review
  if (showQuestionReview && questions.length > 0) {
    return (
      <QuestionReview
        examName={`Paper - ${resultData?.paperName || 'Paper'}`}
        questions={questions}
        answers={getAnswersArray()}
        markedForReview={getMarkedForReview()}
        onBackToResult={() => setShowQuestionReview(false)}
      />
    );
  }

  // Calculate time taken display
  const minutesTaken = Math.floor(resultData.timeTaken / 60);
  const secondsTaken = resultData.timeTaken % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-orange-50/30 to-stone-100 flex flex-col">
      {/* Header */}
      <Navbar
        variant="examResult"
        title="Exam Completed"
        paperName={resultData.paperName}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-4 sm:py-5 lg:py-6">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          {/* Result Badge */}
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-center mb-4 sm:mb-5 lg:mb-6 ${
            resultData.isPassed
              ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
          } text-white shadow-lg`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              {resultData.isPassed ? (
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
              {resultData.isPassed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm">
              {resultData.isPassed
                ? 'You passed the exam successfully'
                : `You need to score at least ${resultData.passingScore}% to pass`}
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{resultData.score.toFixed(2)}</p>
                <p className="text-white/80 text-xxs sm:text-xs">Your Score</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-white/30"></div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{Math.max(0, resultData.percentage).toFixed(1)}%</p>
                <p className="text-white/80 text-xxs sm:text-xs">Percentage</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800">{resultData.correctAnswers}</p>
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
                  <p className="text-xl sm:text-2xl font-bold text-stone-800">{resultData.incorrectAnswers}</p>
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
                  <p className="text-xl sm:text-2xl font-bold text-stone-800">{resultData.unattemptedQuestions}</p>
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
                  <p className="font-bold text-stone-800 text-sm sm:text-base">{resultData.totalQuestions}</p>
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
                  <p className="font-bold text-stone-800 text-sm sm:text-base">{resultData.attemptedQuestions}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-lg sm:rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-stone-500">Accuracy</p>
                  <p className="font-bold text-stone-800 text-sm sm:text-base">{resultData.accuracy.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {questions.length > 0 && (
              <button
                onClick={() => setShowQuestionReview(true)}
                className="flex-1 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Review Answers
              </button>
            )}
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
