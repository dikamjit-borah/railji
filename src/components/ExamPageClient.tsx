'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { saveExamAttempt, getExamAttemptCount, getBestScore } from '@/lib/examStorage';
import ExamInstructions from './exam/ExamInstructions';
import ExamQuestion from './exam/ExamQuestion';
import QuestionPalette from './exam/QuestionPalette';
import ExamResult from './exam/ExamResult';
import SubmitConfirmation from './exam/SubmitConfirmation';

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
  extras?: Array<{
    en: string;
    hi: string;
  }>;
  correctAnswer: number;
}

interface Exam {
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
}

interface ExamPageClientProps {
  examId: string;
}

export default function ExamPageClient({ examId }: ExamPageClientProps) {
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');
  const [showReviewPalette, setShowReviewPalette] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set());
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [examMode, setExamMode] = useState<'exam' | 'practice' | null>(null);
  
  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsPrefetched, setQuestionsPrefetched] = useState(false);
  const questionsCache = useRef<Question[]>([]);
  
  // Result state from API
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    correctAnswers: number;
    wrongAnswers: number;
    skipped: number;
  } | null>(null);

  // Fetch exam details and prefetch questions
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch exam details
        const examResponse = await fetch(`/api/exams/${examId}`);
        
        if (!examResponse.ok) {
          throw new Error(`Failed to fetch exam details: ${examResponse.statusText}`);
        }
        
        const examResult = await examResponse.json();
        
        if (!examResult.success || !examResult.data) {
          throw new Error(examResult.error?.message || 'Failed to load exam details');
        }
        
        const examData = examResult.data;
        setExam(examData);
        setTimeRemaining(examData.duration * 60);
        
        // Start prefetching questions in background
        prefetchQuestions();
        
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load exam');
        console.error('Error fetching exam details:', err);
      } finally {
        setLoading(false);
      }
    };

    const prefetchQuestions = async () => {
      try {
        setQuestionsLoading(true);
        
        const questionsResponse = await fetch(`/api/exams/${examId}/questions`);
        
        if (!questionsResponse.ok) {
          throw new Error('Failed to prefetch questions');
        }
        
        const questionsResult = await questionsResponse.json();
        
        if (questionsResult.success && questionsResult.data) {
          questionsCache.current = questionsResult.data.questions;
          setQuestionsPrefetched(true);
        }
      } catch (err) {
        console.error('Error prefetching questions:', err);
        // Don't set error here, we'll try again when exam starts
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted || showResult || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, showResult, timeRemaining]);

  // Prevent accidental navigation during exam
  useEffect(() => {
    if (!hasStarted || showResult) return;

    // Handle browser back button
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowSubmitConfirm(true);
    };

    // Handle page refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    // Push a state to handle back button
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasStarted, showResult]);

  const handleStartExam = async (mode: 'exam' | 'practice') => {
    setExamMode(mode);
    try {
      // Use cached questions if available, otherwise fetch now
      if (questionsPrefetched && questionsCache.current.length > 0) {
        setQuestions(questionsCache.current);
        setAnswers(new Array(questionsCache.current.length).fill(null));
        setMarkedForReview(new Array(questionsCache.current.length).fill(false));
        setHasStarted(true);
        setVisitedQuestions(new Set([0])); // Mark first question as visited
      } else {
        // Questions weren't prefetched, fetch them now
        setQuestionsLoading(true);
        const questionsResponse = await fetch(`/api/exams/${examId}/questions`);
        
        if (!questionsResponse.ok) {
          throw new Error('Failed to load questions');
        }
        
        const questionsResult = await questionsResponse.json();
        
        if (questionsResult.success && questionsResult.data) {
          const questionsData = questionsResult.data.questions;
          setQuestions(questionsData);
          setAnswers(new Array(questionsData.length).fill(null));
          setMarkedForReview(new Array(questionsData.length).fill(false));
          setHasStarted(true);
          setVisitedQuestions(new Set([0]));
        } else {
          throw new Error('Failed to load questions');
        }
        
        setQuestionsLoading(false);
      }
    } catch (err) {
      setError('Failed to load exam questions. Please try again.');
      console.error('Error loading questions:', err);
    }
  };

  const handleToggleMarkForReview = () => {
    const newMarked = [...markedForReview];
    newMarked[currentQuestionIndex] = !newMarked[currentQuestionIndex];
    setMarkedForReview(newMarked);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    // If the same option is clicked again, deselect it
    if (selectedAnswer === optionIndex) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(optionIndex);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(answers[nextIndex]);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    } else {
      // On last question, show submit confirmation
      handleSubmitClick();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      if (selectedAnswer !== null) {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = selectedAnswer;
        setAnswers(newAnswers);
      }
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedAnswer(answers[prevIndex]);
      setVisitedQuestions(prev => new Set([...prev, prevIndex]));
    }
  };

  const handleSubmit = async () => {
    const newAnswers = [...answers];
    if (selectedAnswer !== null) {
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }
    
    try {
      // Submit exam to API
      const timeTaken = (exam?.duration || 0) * 60 - timeRemaining;
      
      const submitResponse = await fetch(`/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: newAnswers,
          timeTaken,
        }),
      });
      
      if (!submitResponse.ok) {
        throw new Error('Failed to submit exam');
      }
      
      const submitResult = await submitResponse.json();
      
      if (submitResult.success && submitResult.data) {
        const { score, percentage, passed, correctAnswers, wrongAnswers, skipped } = submitResult.data;
        
        // Store submission result
        setSubmissionResult({ score, percentage, passed, correctAnswers, wrongAnswers, skipped });
        
        // Save attempt to localStorage
        if (exam) {
          saveExamAttempt({
            examId: exam.id,
            examName: exam.name,
            date: new Date().toISOString(),
            score,
            totalQuestions: questions.length,
            percentage,
            timeTaken,
            passed,
            correctAnswers,
            wrongAnswers,
            skipped,
            answers: newAnswers,
          });
        }
        
        setShowResult(true);
        setShowSubmitConfirm(false);
      } else {
        throw new Error(submitResult.error?.message || 'Failed to submit exam');
      }
    } catch (err) {
      setError('Failed to submit exam. Please try again.');
      console.error('Error submitting exam:', err);
      setShowSubmitConfirm(false);
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleQuestionJump = (index: number) => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }
    setCurrentQuestionIndex(index);
    setSelectedAnswer(answers[index]);
    setVisitedQuestions(prev => new Set([...prev, index]));
    setShowMobilePalette(false);
  };

  // Get question status for palette
  const getQuestionStatus = (index: number): 'current' | 'answered' | 'marked' | 'not-answered' | 'not-visited' => {
    if (index === currentQuestionIndex) return 'current';
    if (answers[index] !== null) return 'answered';
    if (markedForReview[index]) return 'marked';
    if (visitedQuestions.has(index)) return 'not-answered';
    return 'not-visited';
  };

  const calculateScore = () => {
    if (!exam) return { score: 0, percentage: 0, passed: false };

    let score = 0;
    const negativeMarking = -1/3; // Negative marking for wrong answers
    
    answers.forEach((answer, index) => {
      if (answer !== null) {
        if (answer === questions[index].correctAnswer) {
          score++; // +1 for correct answer
        } else {
          score += negativeMarking; // -1/3 for wrong answer
        }
      }
      // No marks deducted for skipped questions (answer === null)
    });

    // Round score to 2 decimal places and ensure it's not negative
    score = Math.max(0, Math.round(score * 100) / 100);

    const totalQuestions = questions.length;
    // Calculate percentage based on actual score vs total possible marks
    const percentage = (score / totalQuestions) * 100;
    const passingMarks = totalQuestions * 0.4; // 40% of total questions
    const passed = score >= passingMarks;

    return { score, percentage, passed };
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredQuestions = () => {
    if (!exam) return [];
    
    return questions
      .map((q, index) => ({ question: q, index, answer: answers[index] }))
      .filter(({ question, index, answer }) => {
        if (reviewFilter === 'all') return true;
        if (reviewFilter === 'correct') return answer === question.correctAnswer;
        if (reviewFilter === 'wrong') return answer !== null && answer !== question.correctAnswer;
        if (reviewFilter === 'skipped') return answer === null;
        return true;
      });
  };

  const getFilterCounts = () => {
    if (!exam) return { all: 0, correct: 0, wrong: 0, skipped: 0 };
    
    let correct = 0, wrong = 0, skipped = 0;
    questions.forEach((q, index) => {
      const answer = answers[index];
      if (answer === null) skipped++;
      else if (answer === q.correctAnswer) correct++;
      else wrong++;
    });
    
    return { all: questions.length, correct, wrong, skipped };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading exam details...</h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <svg className="w-20 h-20 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Exam</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <svg className="w-20 h-20 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Exam not found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const totalQuestions = exam.totalQuestions;
  const examDuration = exam.duration;
  const examDescription = exam.description;

  // Get attempt history from localStorage
  const attemptCount = getExamAttemptCount(examId);
  const bestScore = attemptCount > 0 ? getBestScore(examId) : null;

  if (!hasStarted) {
    return (
      <ExamInstructions
        exam={exam}
        questionsLoading={questionsLoading}
        questionsPrefetched={questionsPrefetched}
        attemptCount={attemptCount}
        bestScore={bestScore}
        onStartExam={handleStartExam}
      />
    );
  }

  if (showResult) {
    // Use API result if available, otherwise fallback to calculateScore
    const resultData = submissionResult || calculateScore();
    const { score, percentage, passed } = resultData;
    const correctAnswers = submissionResult?.correctAnswers || answers.filter((answer, index) => 
      answer !== null && answer === questions[index].correctAnswer
    ).length;
    const wrongAnswers = submissionResult?.wrongAnswers || answers.filter((answer, index) => 
      answer !== null && answer !== questions[index].correctAnswer
    ).length;
    const skipped = submissionResult?.skipped || answers.filter(answer => answer === null).length;
    
    const timeTaken = (exam?.duration || 0) * 60 - timeRemaining;

    // Show main result screen
    if (!showQuestionReview) {
      return (
        <ExamResult
          exam={exam}
          questions={questions}
          answers={answers}
          score={score}
          percentage={percentage}
          passed={passed}
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          skipped={skipped}
          timeTaken={timeTaken}
          onReviewAnswers={() => setShowQuestionReview(true)}
        />
      );
    }
    
    // Question Review View (keep existing implementation)
    const filteredQuestions = getFilteredQuestions();
    const filterCounts = getFilterCounts();
    const currentFilteredItem = filteredQuestions[reviewQuestionIndex];
    const reviewQuestion = currentFilteredItem?.question || questions[0];
    const actualQuestionIndex = currentFilteredItem?.index || 0;
    const userAnswer = answers[actualQuestionIndex];
    const isCorrect = userAnswer === reviewQuestion.correctAnswer;

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-100 via-orange-50/30 to-stone-100 flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowQuestionReview(false)}
                    className="p-1.5 sm:p-2 hover:bg-stone-100 rounded-lg sm:rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xs sm:text-sm font-bold text-stone-800">Question Review</h1>
                    <p className="text-xxs sm:text-xs text-stone-500">{exam?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setShowReviewPalette(true)}
                    className="p-1.5 sm:p-2 hover:bg-stone-100 rounded-lg sm:rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                    </svg>
                  </button>
                  <img
                    src="/images/logo.png"
                    alt="RailJee Logo"
                    className="h-10 sm:h-12 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white border-b border-stone-100">
            <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => { setReviewFilter('all'); setReviewQuestionIndex(0); }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xxs sm:text-xs transition-all ${
                    reviewFilter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All ({filterCounts.all})
                </button>
                <button
                  onClick={() => { setReviewFilter('correct'); setReviewQuestionIndex(0); }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xxs sm:text-xs transition-all ${
                    reviewFilter === 'correct' ? 'bg-yellow-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Correct ({filterCounts.correct})
                </button>
                <button
                  onClick={() => { setReviewFilter('wrong'); setReviewQuestionIndex(0); }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xxs sm:text-xs transition-all ${
                    reviewFilter === 'wrong' ? 'bg-red-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Wrong ({filterCounts.wrong})
                </button>
                <button
                  onClick={() => { setReviewFilter('skipped'); setReviewQuestionIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    reviewFilter === 'skipped' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Skipped ({filterCounts.skipped})
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-6">
              {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-1">No Questions Found</h4>
                  <p className="text-sm text-stone-500">
                    {reviewFilter === 'correct' && 'No questions were answered correctly.'}
                    {reviewFilter === 'wrong' && 'No questions were answered incorrectly.'}
                    {reviewFilter === 'skipped' && 'No questions were skipped.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* ExamQuestion Component with Review Mode */}
                  <div className="mb-4">
                    <ExamQuestion
                      question={reviewQuestion}
                      questionIndex={actualQuestionIndex}
                      totalQuestions={questions.length}
                      selectedAnswer={userAnswer}
                      onSelectAnswer={() => {}} // No-op in review mode
                      reviewMode={true}
                      correctAnswer={reviewQuestion.correctAnswer}
                    />
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      {/* Previous Button */}
                      <button
                        onClick={() => setReviewQuestionIndex(Math.max(0, reviewQuestionIndex - 1))}
                        disabled={reviewQuestionIndex === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-all font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={() => setReviewQuestionIndex(Math.min(filteredQuestions.length - 1, reviewQuestionIndex + 1))}
                        disabled={reviewQuestionIndex === filteredQuestions.length - 1}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span>Next</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>

          {/* Review Question Palette */}
          <QuestionPalette
            totalQuestions={questions.length}
            currentQuestionIndex={actualQuestionIndex}
            answers={answers}
            markedForReview={markedForReview}
            visitedQuestions={new Set(questions.map((_, i) => i))}
            onQuestionJump={(index) => {
              const filteredIndex = filteredQuestions.findIndex(item => item.index === index);
              if (filteredIndex !== -1) {
                setReviewQuestionIndex(filteredIndex);
              }
              setShowReviewPalette(false);
            }}
            showMobile={showReviewPalette}
            onCloseMobile={() => setShowReviewPalette(false)}
            reviewMode={true}
            questions={questions}
          />
        </div>
      );
  }

  // Get status colors for question palette
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'border-2 border-blue-500 bg-white text-stone-800 ring-2 ring-blue-300';
      case 'answered':
        return 'bg-blue-400 text-white border-2 border-blue-400';
      case 'marked':
        return 'bg-amber-500 text-white border-2 border-amber-500';
      case 'not-answered':
        return 'bg-stone-400 text-white border-2 border-stone-400';
      default:
        return 'bg-white text-stone-600 border-2 border-stone-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-orange-50/30 to-stone-100 flex flex-col">
      {/* Compact Header - Sticky */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            {/* Left - Title */}
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-8 sm:h-10 w-auto"
              />
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-stone-800 leading-tight">{exam.name}</h1>
                <p className="text-xxs sm:text-xs text-stone-500">Q {currentQuestionIndex + 1}/{totalQuestions}</p>
              </div>
            </div>

            {/* Right - Timer, Grid Icon & Submit */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Timer */}
              <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xxs sm:text-xs font-bold ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-700'
              }`}>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(timeRemaining)}</span>
              </div>

              {/* Question Palette Toggle */}
              <button
                onClick={() => setShowMobilePalette(true)}
                className="p-1.5 sm:p-2 hover:bg-stone-100 rounded-lg transition-all relative border border-stone-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                </svg>
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {answeredCount}
                </span>
              </button>

              {/* Submit Button - Hidden on mobile */}
              <button
                onClick={handleSubmitClick}
                className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:shadow-lg transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-stone-200">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center">
        {/* Question Area - Centered with wider max-width */}
        <div className="w-full max-w-5xl p-3 sm:p-4 lg:p-6">
          <div className="w-full">
            {/* Use ExamQuestion Component */}
            <div className="mb-3 sm:mb-4">
              <ExamQuestion
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
                markedForReview={markedForReview[currentQuestionIndex]}
                onToggleMarkForReview={handleToggleMarkForReview}
                onSubmit={handleSubmitClick}
                showSubmitButton={true}
                practiceMode={examMode === 'practice'}
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-stone-100 text-stone-700 rounded-lg sm:rounded-xl hover:bg-stone-200 transition-all font-semibold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Next/Submit Button */}
                <button
                  onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmitClick : handleNextQuestion}
                  className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all font-semibold text-xs sm:text-sm ${
                    currentQuestionIndex === totalQuestions - 1
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
                  }`}
                >
                  <span>{currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <SubmitConfirmation
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          visitedCount={visitedQuestions.size}
          skippedCount={answers.filter(a => a === null).length}
          markedCount={markedForReview.filter(Boolean).length}
          answers={answers}
          markedForReview={markedForReview}
          visitedQuestions={visitedQuestions}
          onSubmit={handleSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
          onQuestionJump={handleQuestionJump}
        />
      )}

      {/* Mobile Question Palette */}
      <QuestionPalette
        totalQuestions={totalQuestions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        markedForReview={markedForReview}
        visitedQuestions={visitedQuestions}
        onQuestionJump={handleQuestionJump}
        showMobile={showMobilePalette}
        onCloseMobile={() => setShowMobilePalette(false)}
      />
    </div>
  );
}
