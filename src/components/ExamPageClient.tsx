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

  const handleStartExam = async () => {
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

  const handleSkipQuestion = () => {
    // Save current answer if any
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }
    
    // Move to next question without requiring an answer
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(answers[nextIndex]);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
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

    // Round score to 2 decimal places
    score = Math.round(score * 100) / 100;

    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;
    const passingMarks = Math.ceil(totalQuestions * 0.4); // 40% passing criteria
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
        <div className="min-h-screen bg-gradient-to-br from-stone-100 via-teal-50/30 to-stone-100 flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQuestionReview(false)}
                    className="p-2 hover:bg-stone-100 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-sm font-bold text-stone-800">Question Review</h1>
                    <p className="text-xs text-stone-500">{exam?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewPalette(true)}
                  className="p-2 hover:bg-stone-100 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white border-b border-stone-100">
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setReviewFilter('all'); setReviewQuestionIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    reviewFilter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All ({filterCounts.all})
                </button>
                <button
                  onClick={() => { setReviewFilter('correct'); setReviewQuestionIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    reviewFilter === 'correct' ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Correct ({filterCounts.correct})
                </button>
                <button
                  onClick={() => { setReviewFilter('wrong'); setReviewQuestionIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    reviewFilter === 'wrong' ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
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
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Question Header */}
                  <div className={`px-5 py-4 ${
                    isCorrect ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : userAnswer === null ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-pink-600'
                  } text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-lg">
                          {actualQuestionIndex + 1}
                        </span>
                        <div>
                          <p className="text-sm opacity-90">Question {reviewQuestionIndex + 1} of {filteredQuestions.length}</p>
                          <p className="text-xs opacity-75">
                            {isCorrect ? 'Answered Correctly' : userAnswer === null ? 'Skipped' : 'Answered Incorrectly'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setReviewQuestionIndex(Math.max(0, reviewQuestionIndex - 1))}
                          disabled={reviewQuestionIndex === 0}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setReviewQuestionIndex(Math.min(filteredQuestions.length - 1, reviewQuestionIndex + 1))}
                          disabled={reviewQuestionIndex === filteredQuestions.length - 1}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="p-5 border-b border-stone-100">
                    <p className="text-base font-semibold text-stone-800 leading-relaxed mb-2">
                      {reviewQuestion.question.en}
                    </p>
                    <p className="text-sm text-stone-600 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                      {reviewQuestion.question.hi}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="p-4 space-y-3">
                    {reviewQuestion.options.en.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = reviewQuestion.correctAnswer === optIndex;
                      const optionLetter = String.fromCharCode(65 + optIndex);

                      let optionStyle = 'border-stone-200 bg-white';
                      let badgeStyle = 'bg-stone-100 text-stone-600';
                      
                      if (isCorrectAnswer) {
                        optionStyle = 'border-emerald-500 bg-emerald-50';
                        badgeStyle = 'bg-emerald-500 text-white';
                      } else if (isUserAnswer) {
                        optionStyle = 'border-rose-500 bg-rose-50';
                        badgeStyle = 'bg-rose-500 text-white';
                      }

                      return (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-xl border-2 ${optionStyle}`}
                        >
                          <div className="flex items-start gap-4">
                            <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${badgeStyle}`}>
                              {optionLetter}
                            </span>
                            <div className="flex-1 pt-1">
                              <p className={`text-sm font-medium mb-1 ${isCorrectAnswer ? 'text-emerald-800' : isUserAnswer ? 'text-rose-800' : 'text-stone-700'}`}>
                                {option}
                              </p>
                              <p className="text-xs text-stone-500">
                                {reviewQuestion.options.hi[optIndex]}
                              </p>
                            </div>
                            {isCorrectAnswer && (
                              <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="flex-shrink-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Review Question Palette Drawer */}
          {showReviewPalette && (
            <div 
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowReviewPalette(false)}
            >
              <div 
                className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl flex flex-col animate-slide-right"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100 bg-stone-50">
                  <button
                    onClick={() => setShowReviewPalette(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors"
                  >
                    <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="text-right">
                    <h3 className="font-bold text-stone-800">Question Overview</h3>
                    <p className="text-xs text-stone-500">{filteredQuestions.length} questions</p>
                  </div>
                </div>

                {/* Question Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-4 gap-3">
                    {questions.map((question, index) => {
                      const answer = answers[index];
                      const isCurrentQuestion = filteredQuestions[reviewQuestionIndex]?.index === index;
                      const isCorrectAnswer = answer === question.correctAnswer;
                      const isWrongAnswer = answer !== null && !isCorrectAnswer;
                      
                      let buttonStyle = 'border-2 border-amber-400 bg-amber-100 text-amber-700';
                      if (isCurrentQuestion) {
                        buttonStyle = 'border-2 border-teal-500 bg-teal-500 text-white ring-2 ring-teal-300';
                      } else if (isCorrectAnswer) {
                        buttonStyle = 'border-2 border-emerald-500 bg-emerald-500 text-white';
                      } else if (isWrongAnswer) {
                        buttonStyle = 'border-2 border-rose-500 bg-rose-500 text-white';
                      }
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            const filteredIndex = filteredQuestions.findIndex(item => item.index === index);
                            if (filteredIndex !== -1) {
                              setReviewQuestionIndex(filteredIndex);
                            }
                            setShowReviewPalette(false);
                          }}
                          className={`h-11 w-11 rounded-full font-semibold transition-all text-sm mx-auto ${buttonStyle}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="p-4 border-t border-stone-100 bg-stone-50">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                      <span className="text-stone-600">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                      <span className="text-stone-600">Wrong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-100 border-2 border-amber-400"></div>
                      <span className="text-stone-600">Skipped</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-teal-500 ring-2 ring-teal-300"></div>
                      <span className="text-stone-600">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
  }

  // Get status colors for question palette
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg ring-2 ring-teal-300';
      case 'answered':
        return 'bg-gradient-to-br from-emerald-400 to-green-500 text-white';
      case 'marked':
        return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white';
      case 'not-answered':
        return 'bg-gradient-to-br from-rose-400 to-red-500 text-white';
      default:
        return 'bg-stone-200 text-stone-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-teal-50/30 to-stone-100 flex flex-col">
      {/* Compact Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Back & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-stone-100 rounded-xl transition-all"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-sm font-bold text-stone-800">{exam.name}</h1>
                <p className="text-xs text-stone-500">Q {currentQuestionIndex + 1}/{totalQuestions}</p>
              </div>
            </div>

            {/* Right - Timer, Grid Icon & Submit grouped together */}
            <div className="flex items-center gap-2">
              {/* Timer */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-700'
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(timeRemaining)}</span>
              </div>

              {/* Question Palette Toggle */}
              <button
                onClick={() => setShowMobilePalette(true)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-all relative border border-stone-200"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
                </svg>
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-teal-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {answeredCount}
                </span>
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmitClick}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-stone-200">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center">
        {/* Question Area - Centered */}
        <div className="w-full max-w-2xl p-4 lg:p-6">
          <div className="w-full">
            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              {/* Question Header */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {currentQuestionIndex + 1}
                    </span>
                    <div className="text-white">
                      <p className="text-sm opacity-90">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                      <p className="text-xs opacity-75">+1 for correct, -0.33 for wrong</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleMarkForReview}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      markedForReview[currentQuestionIndex]
                        ? 'bg-amber-400 text-amber-900'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={markedForReview[currentQuestionIndex] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="hidden sm:inline">{markedForReview[currentQuestionIndex] ? 'Marked' : 'Mark for Review'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text - Both Languages */}
              <div className="p-5 sm:p-6 border-b border-stone-100">
                <p className="text-base sm:text-lg font-semibold text-stone-800 leading-relaxed mb-3">
                  {currentQuestion.question.en}
                </p>
                <p className="text-sm text-stone-600 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  {currentQuestion.question.hi}
                </p>
              </div>

              {/* Options - Both Languages */}
              <div className="p-4 sm:p-5 space-y-3">
                {currentQuestion.options.en.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const optionLetter = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50 shadow-md'
                          : 'border-stone-200 hover:border-teal-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Option Letter Badge */}
                        <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all ${
                          isSelected
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'bg-stone-100 text-stone-600 group-hover:bg-teal-100 group-hover:text-teal-700'
                        }`}>
                          {optionLetter}
                        </span>

                        {/* Option Content - Both Languages */}
                        <div className="flex-1 pt-1">
                          <p className={`text-sm sm:text-base font-medium mb-1 ${
                            isSelected ? 'text-teal-800' : 'text-stone-700'
                          }`}>
                            {option}
                          </p>
                          <p className="text-xs sm:text-sm text-stone-500">
                            {currentQuestion.options.hi[index]}
                          </p>
                        </div>

                        {/* Checkmark for selected */}
                        {isSelected && (
                          <span className="flex-shrink-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between gap-3">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-all font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Center Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSkipQuestion}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="px-4 py-2.5 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-all font-medium text-sm disabled:opacity-40"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleToggleMarkForReview}
                    className={`px-4 py-2.5 rounded-xl transition-all font-medium text-sm hidden sm:flex items-center gap-2 ${
                      markedForReview[currentQuestionIndex]
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={markedForReview[currentQuestionIndex] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Review
                  </button>
                </div>

                {/* Next/Submit Button */}
                <button
                  onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmitClick : handleNextQuestion}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                    currentQuestionIndex === totalQuestions - 1
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg'
                  }`}
                >
                  <span>{currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
