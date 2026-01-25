'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import examData from '@/data/exams.json';
import { saveExamAttempt, getExamAttemptCount, getBestScore } from '@/lib/examStorage';

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

  useEffect(() => {
    // Find exam from static data
    const foundExam = examData.exams.find(e => e.id === examId);
    if (foundExam) {
      setExam(foundExam);
      const examQuestions = (examData.questions as any)[examId] || [];
      setQuestions(examQuestions);
      setTimeRemaining(foundExam.duration * 60);
      setAnswers(new Array(examQuestions.length).fill(null));
      setMarkedForReview(new Array(examQuestions.length).fill(false));
    }
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

  const handleStartExam = () => {
    setHasStarted(true);
    setVisitedQuestions(new Set([0])); // Mark first question as visited
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

  const handleSubmit = () => {
    const newAnswers = [...answers];
    if (selectedAnswer !== null) {
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }
    
    // Calculate results
    const { score, percentage, passed } = calculateScore();
    const timeTaken = (exam?.duration || 0) * 60 - timeRemaining;
    const correctAnswers = newAnswers.filter((answer, index) => 
      answer !== null && answer === questions[index].correctAnswer
    ).length;
    const wrongAnswers = newAnswers.filter((answer, index) => 
      answer !== null && answer !== questions[index].correctAnswer
    ).length;
    const skipped = newAnswers.filter(answer => answer === null).length;
    
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

  if (!exam || questions.length === 0) {
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
  const totalQuestions = questions.length;
  const examDuration = exam.duration;
  const examDescription = exam.description;

  // Get attempt history from localStorage
  const attemptCount = getExamAttemptCount(examId);
  const bestScore = attemptCount > 0 ? getBestScore(examId) : null;

  if (!hasStarted) {
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
                {examDescription} • {(Math.random() * 20 + 5).toFixed(1)}k students took this
              </p>
            </div>

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
                  <div className="text-lg lg:text-xl font-bold text-stone-900">{totalQuestions}</div>
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
                  <div className="text-lg lg:text-xl font-bold text-stone-900">{examDuration} mins</div>
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
                        <p className="text-2xl font-bold text-amber-900">{bestScore.percentage.toFixed(1)}%</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur rounded-xl p-4">
                        <p className="text-xs text-amber-700 mb-1">Status</p>
                        <div className="flex items-center gap-1.5">
                          {bestScore.passed ? (
                            <>
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <p className="text-sm font-semibold text-green-700">Passed</p>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <p className="text-sm font-semibold text-rose-700">Try Again</p>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Before You Start Section */}
            <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100">
                Before you start
              </h2>
              <ul className="space-y-3 lg:space-y-3.5">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-stone-600">You must complete this test in one session - make sure your internet is reliable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-stone-600">1 mark awarded for a correct answer. Negative marking of -0.33 for each wrong answer.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-stone-600">More you give the correct answer more chance to win the badge.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-stone-600">If you don&apos;t earn a badge this time, you can retake this test once more.</span>
                </li>
              </ul>
            </div>

            {/* All the Best Message */}
            <div className="text-center mb-6">
              <p className="text-stone-400 text-sm lg:text-base uppercase tracking-wider font-medium">All the best!!</p>
            </div>
          </div>
        </main>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-stone-100 p-4 lg:p-5">
          <div className="max-w-5xl mx-auto flex items-center gap-3 lg:gap-4">
            <button 
              onClick={() => router.back()}
              className="p-3 lg:p-3.5 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              onClick={handleStartExam}
              className="flex-1 py-4 lg:py-4.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-base lg:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const { score, percentage, passed } = calculateScore();
    const filteredQuestions = getFilteredQuestions();
    const filterCounts = getFilterCounts();
    
    // Format time taken
    const timeTaken = (exam?.duration || 0) * 60 - timeRemaining;
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    
    // Calculate answered questions
    const answeredCount = answers.filter(a => a !== null).length;

    // Question Review View
    if (showQuestionReview) {
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

    // Main Result Screen - Celebration Style
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-teal-50/30 to-stone-100 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md animate-scale-up">
            {/* Celebration Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Confetti/Celebration Header */}
              <div className={`relative pt-10 pb-8 px-6 text-center ${
                passed 
                  ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600'
              }`}>
                {/* Decorative circles */}
                <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-white/30"></div>
                <div className="absolute top-8 left-10 w-2 h-2 rounded-full bg-white/20"></div>
                <div className="absolute top-6 right-8 w-4 h-4 rounded-full bg-white/25"></div>
                <div className="absolute top-12 right-4 w-2 h-2 rounded-full bg-white/30"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-white/20"></div>
                <div className="absolute bottom-4 right-12 w-3 h-3 rounded-full bg-white/25"></div>
                
                {/* Trophy/Completion Icon */}
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  {passed ? (
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  {passed ? 'Congratulations! 🎉' : 'Keep Going! 💪'}
                </h2>
                <p className="text-white/90 text-sm">
                  You have completed
                </p>
                <p className="text-white font-semibold mt-1">
                  {exam?.name}
                </p>
              </div>

              {/* Results Section */}
              <div className="p-6">
                <p className="text-center text-stone-500 text-sm mb-5">Here are your results:</p>
                
                {/* Stats Grid - 2x2 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Total Questions */}
                  <div className="bg-stone-50 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-stone-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-stone-800">{totalQuestions}</p>
                    <p className="text-xs text-stone-500">Total Questions</p>
                  </div>

                  {/* Working Time */}
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{minutesTaken}:{secondsTaken.toString().padStart(2, '0')}</p>
                    <p className="text-xs text-blue-600">Time Taken</p>
                  </div>

                  {/* Quiz Score */}
                  <div className={`${passed ? 'bg-emerald-50' : 'bg-rose-50'} rounded-xl p-4 text-center`}>
                    <div className={`w-10 h-10 ${passed ? 'bg-emerald-200' : 'bg-rose-200'} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <svg className={`w-5 h-5 ${passed ? 'text-emerald-600' : 'text-rose-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className={`text-lg font-bold ${passed ? 'text-emerald-700' : 'text-rose-700'}`}>{percentage.toFixed(0)}%</p>
                    <p className={`text-xs ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>Score</p>
                  </div>

                  {/* Answered Questions */}
                  <div className="bg-teal-50 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-teal-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-teal-700">{answeredCount}/{totalQuestions}</p>
                    <p className="text-xs text-teal-600">Answered</p>
                  </div>
                </div>

                {/* Review Questions Button */}
                <button
                  onClick={() => setShowQuestionReview(true)}
                  className="w-full mt-5 py-3.5 bg-stone-100 text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Review Questions
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-stone-100 p-4">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3.5 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-all"
            >
              Retake
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
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

      {/* Question Palette Drawer - Slides from Right */}
      {showMobilePalette && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowMobilePalette(false)}
        >
          <div 
            className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl flex flex-col animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100 bg-stone-50">
              <button
                onClick={() => setShowMobilePalette(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-right">
                <h3 className="font-bold text-stone-800">Theory Questions</h3>
                <p className="text-xs text-stone-500">Question : {totalQuestions} Answered : {answeredCount}</p>
              </div>
            </div>

            {/* Question Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-3">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isAnswered = answers[index] !== null;
                  const isMarked = markedForReview[index];
                  const isVisited = visitedQuestions.has(index);
                  const isCurrent = index === currentQuestionIndex;
                  
                  let buttonStyle = 'border-2 border-stone-300 text-stone-600 bg-white';
                  if (isCurrent) {
                    buttonStyle = 'border-2 border-teal-500 bg-teal-500 text-white';
                  } else if (isAnswered) {
                    buttonStyle = 'border-2 border-emerald-500 bg-emerald-500 text-white';
                  } else if (isMarked) {
                    buttonStyle = 'border-2 border-amber-500 bg-amber-500 text-white';
                  } else if (isVisited) {
                    buttonStyle = 'border-2 border-rose-500 bg-rose-500 text-white';
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        handleQuestionJump(index);
                        setShowMobilePalette(false);
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
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-500"></div>
                  <span className="text-stone-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-500"></div>
                  <span className="text-stone-600">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-500"></div>
                  <span className="text-stone-600">Mark of Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-stone-300"></div>
                  <span className="text-stone-600">Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combined Review & Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-center border-b border-white/20">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Review & Submit</h3>
              <p className="text-sm text-white/90">Check your responses before final submission</p>
            </div>

            {/* Stats Summary */}
            <div className="p-5 bg-stone-50 border-b border-stone-100">
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-emerald-600">{answers.filter(a => a !== null).length}</p>
                  <p className="text-[10px] text-emerald-700 uppercase tracking-wide">Answered</p>
                </div>
                <div className="bg-stone-100 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-stone-600">{visitedQuestions.size}</p>
                  <p className="text-[10px] text-stone-700 uppercase tracking-wide">Visited</p>
                </div>
                <div className="bg-rose-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-rose-600">{answers.filter(a => a === null).length}</p>
                  <p className="text-[10px] text-rose-700 uppercase tracking-wide">Skipped</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-amber-600">{markedForReview.filter(Boolean).length}</p>
                  <p className="text-[10px] text-amber-700 uppercase tracking-wide">Review</p>
                </div>
              </div>
            </div>

            {/* Question Overview */}
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-3 font-medium">Question Overview</p>
              <div className="grid grid-cols-8 gap-2">
                {questions.map((_, index) => {
                  const isAnswered = answers[index] !== null;
                  const isMarked = markedForReview[index];
                  
                  let bgColor = 'bg-stone-200 text-stone-600';
                  if (isAnswered) bgColor = 'bg-emerald-500 text-white';
                  else if (isMarked) bgColor = 'bg-amber-500 text-white';
                  else if (visitedQuestions.has(index)) bgColor = 'bg-rose-500 text-white';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setShowSubmitConfirm(false);
                        handleQuestionJump(index);
                      }}
                      className={`h-8 rounded-lg font-medium text-xs transition-all hover:scale-105 ${bgColor}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500"></div>
                  <span className="text-stone-600">Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-rose-500"></div>
                  <span className="text-stone-600">Not Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-500"></div>
                  <span className="text-stone-600">For Review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-stone-200"></div>
                  <span className="text-stone-600">Not Visited</span>
                </div>
              </div>

              {/* Warning Message */}
              <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800 text-center">
                  ⚠️ You cannot change your answers after submission
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 border-t border-stone-100 bg-stone-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-3 bg-white border-2 border-stone-300 text-stone-700 rounded-xl font-semibold hover:bg-stone-100 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
