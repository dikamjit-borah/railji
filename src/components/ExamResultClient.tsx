'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { Question } from '@/lib/types';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './common/ErrorScreen';
import QuestionReview from './QuestionReview';
import Navbar from './common/Navbar';
import ExamResult from './exam/ExamResult';
import ExamResultActions from './exam/ExamResultActions';

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
  timeTaken: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  status: string;
  percentile: number;
  isPassed: boolean;
  passPercentage: number;
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
                    const questionId = ans.questionId ?? ans.id;
                    const correctAnswer = ans.correct ?? ans.answer;
                    correctAnswersMap.set(questionId, correctAnswer);
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
    return <LoadingScreen 
      isLoading={true} 
      message="Loading exam results..." 
      animationPath="/animation/Trainbasic.lottie/a/Scene.json"
    />;
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
          <ExamResult
            isPassed={resultData.isPassed}
            passPercentage={resultData.passPercentage}
            score={resultData.score}
            percentage={resultData.percentage}
            correctAnswers={resultData.correctAnswers}
            incorrectAnswers={resultData.incorrectAnswers}
            unattemptedQuestions={resultData.unattemptedQuestions}
            totalQuestions={resultData.totalQuestions}
            timeTaken={resultData.timeTaken}
            attemptedQuestions={resultData.attemptedQuestions}
            accuracy={resultData.accuracy}
          />

          <ExamResultActions
            hasQuestions={questions.length > 0}
            onReviewAnswers={() => setShowQuestionReview(true)}
            onBackToHome={() => router.push('/')}
          />
        </div>
      </main>
    </div>
  );
}
