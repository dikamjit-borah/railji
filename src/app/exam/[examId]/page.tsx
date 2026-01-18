'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Option {
  en: string;
  hi: string;
}

interface Question {
  ques: string;
  ques_hi: string;
  options: Option[];
  correct: number;
}

interface ExamData {
  _id: string;
  examName: string;
  department: string[];
  totalQuestions: number;
  duration: number;
  description: string;
  status: string;
  language: string[];
}

interface PaperData {
  _id: string;
  examName: string;
  department: string;
  year: string;
  location: string;
  questions: Question[];
}

interface Exam {
  examData: ExamData;
  paperData: PaperData;
}

type Language = 'en' | 'hi';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');
  const [showReviewPalette, setShowReviewPalette] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        // Parse examId format: examName_department (e.g., junior_engineer_mechanical)
        const parts = examId.split('_');
        const department = parts.pop() || '';
        const examName = parts.join('_');

        // Fetch exam metadata
        const examResponse = await fetch(`/api/exams/${examName}`);
        if (!examResponse.ok) throw new Error('Failed to fetch exam');
        const examResult = await examResponse.json();

        // Fetch paper with questions
        const paperResponse = await fetch(`/api/papers/${examName}/${department}`);
        if (!paperResponse.ok) throw new Error('Failed to fetch paper');
        const paperResult = await paperResponse.json();

        const examData: Exam = {
          examData: examResult.data,
          paperData: paperResult.data,
        };

        setExam(examData);
        setTimeRemaining(examResult.data.duration * 60);
        setAnswers(new Array(paperResult.data.questions.length).fill(null));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError('Failed to load exam. Please try again.');
        setLoading(false);
      }
    };

    fetchExamData();
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

    if (currentQuestionIndex < (exam?.paperData.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
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
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const handleSubmit = () => {
    const newAnswers = [...answers];
    if (selectedAnswer !== null) {
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
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
    setShowMobilePalette(false);
  };

  const calculateScore = () => {
    if (!exam) return { score: 0, percentage: 0, passed: false };

    let score = 0;
    const negativeMarking = -1/3; // Negative marking for wrong answers
    
    answers.forEach((answer, index) => {
      if (answer !== null) {
        if (answer === exam.paperData.questions[index].correct) {
          score++; // +1 for correct answer
        } else {
          score += negativeMarking; // -1/3 for wrong answer
        }
      }
      // No marks deducted for skipped questions (answer === null)
    });

    // Round score to 2 decimal places
    score = Math.round(score * 100) / 100;

    const totalQuestions = exam.paperData.questions.length;
    const percentage = (score / totalQuestions) * 100;
    const passingMarks = Math.ceil(totalQuestions * 0.4); // 40% passing criteria
    const passed = score >= passingMarks;

    return { score, percentage, passed };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredQuestions = () => {
    if (!exam) return [];
    
    return exam.paperData.questions
      .map((q, index) => ({ question: q, index, answer: answers[index] }))
      .filter(({ question, index, answer }) => {
        if (reviewFilter === 'all') return true;
        if (reviewFilter === 'correct') return answer === question.correct;
        if (reviewFilter === 'wrong') return answer !== null && answer !== question.correct;
        if (reviewFilter === 'skipped') return answer === null;
        return true;
      });
  };

  const getFilterCounts = () => {
    if (!exam) return { all: 0, correct: 0, wrong: 0, skipped: 0 };
    
    let correct = 0, wrong = 0, skipped = 0;
    exam.paperData.questions.forEach((q, index) => {
      const answer = answers[index];
      if (answer === null) skipped++;
      else if (answer === q.correct) correct++;
      else wrong++;
    });
    
    return { all: exam.paperData.questions.length, correct, wrong, skipped };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading exam...</h1>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <svg className="w-20 h-20 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Exam not found'}</h1>
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

  if (!exam.paperData.questions || exam.paperData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No questions available</h1>
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

  const currentQuestion = exam.paperData.questions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const totalQuestions = exam.paperData.questions.length;
  const examDuration = exam.examData.duration;
  const examDescription = exam.examData.description;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold mb-1">{exam.examData.examName.replace(/_/g, ' ').toUpperCase()}</h1>
                  <p className="text-blue-100">{exam.paperData.department} - {exam.paperData.year} - {exam.paperData.location}</p>
                  <p className="text-blue-100 text-sm mt-1">{examDescription}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Duration</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{examDuration} <span className="text-lg">mins</span></div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Questions</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{totalQuestions}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Passing</div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{Math.ceil(totalQuestions * 0.4)}<span className="text-lg">/{totalQuestions}</span></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Read each question carefully before selecting an answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Answer will be shown after you select an option</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>You can navigate between questions using Previous and Next buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Toggle between English and Hindi using the language button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>The exam will auto-submit when time runs out</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartExam}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105"
                >
                  Start Exam
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const { score, percentage, passed } = calculateScore();
    const filteredQuestions = getFilteredQuestions();
    const filterCounts = getFilterCounts();
    
    // Use filtered index but maintain original question index
    const currentFilteredItem = filteredQuestions[reviewQuestionIndex];
    const reviewQuestion = currentFilteredItem?.question || exam.paperData.questions[0];
    const actualQuestionIndex = currentFilteredItem?.index || 0;
    const userAnswer = answers[actualQuestionIndex];
    const isCorrect = userAnswer === reviewQuestion.correct;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-4 sm:mb-6">
            <div className={`p-4 sm:p-8 ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} text-white`}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-2 sm:mb-4">
                  {passed ? (
                    <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2">{passed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}</h2>
                <p className="text-white/90 text-sm sm:text-lg">{passed ? 'You have successfully passed the exam!' : 'You need more practice to pass this exam.'}</p>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <div className="grid sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center border-2 border-blue-200">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">Your Score</div>
                  <div className="text-2xl sm:text-4xl font-bold text-blue-600">{score}<span className="text-base sm:text-2xl text-gray-400">/{totalQuestions}</span></div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center border-2 border-purple-200">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">Percentage</div>
                  <div className="text-2xl sm:text-4xl font-bold text-purple-600">{percentage.toFixed(1)}<span className="text-base sm:text-2xl">%</span></div>
                </div>
                <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center border-2 ${passed ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">Result</div>
                  <div className={`text-2xl sm:text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{passed ? 'PASS' : 'FAIL'}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all font-bold text-sm sm:text-base"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 sm:px-8 py-2.5 sm:py-4 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm sm:text-base"
                >
                  Retake Exam
                </button>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Question Review</h3>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => {
                  setReviewFilter('all');
                  setReviewQuestionIndex(0);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  reviewFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({filterCounts.all})
              </button>
              <button
                onClick={() => {
                  setReviewFilter('correct');
                  setReviewQuestionIndex(0);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  reviewFilter === 'correct'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Correct ({filterCounts.correct})
              </button>
              <button
                onClick={() => {
                  setReviewFilter('wrong');
                  setReviewQuestionIndex(0);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  reviewFilter === 'wrong'
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Wrong ({filterCounts.wrong})
              </button>
              <button
                onClick={() => {
                  setReviewFilter('skipped');
                  setReviewQuestionIndex(0);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  reviewFilter === 'skipped'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Skipped ({filterCounts.skipped})
              </button>
            </div>

            {/* Question Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
              <span className="text-sm sm:text-lg font-semibold text-gray-700">
                Q {reviewQuestionIndex + 1}/{filteredQuestions.length} {reviewFilter !== 'all' && `(#${actualQuestionIndex + 1})`}
              </span>
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  onClick={() => setReviewQuestionIndex(Math.max(0, reviewQuestionIndex - 1))}
                  disabled={reviewQuestionIndex === 0}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setReviewQuestionIndex(Math.min(filteredQuestions.length - 1, reviewQuestionIndex + 1))}
                  disabled={reviewQuestionIndex === filteredQuestions.length - 1}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Question Content or No Questions Message */}
            {filteredQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Questions Found</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  {reviewFilter === 'correct' && 'No questions were answered correctly.'}
                  {reviewFilter === 'wrong' && 'No questions were answered incorrectly.'}
                  {reviewFilter === 'skipped' && 'No questions were skipped.'}
                </p>
              </div>
            ) : (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <span className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg ${isCorrect ? 'bg-green-100 text-green-600' : userAnswer === null ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    {actualQuestionIndex + 1}
                  </span>
                <div className="flex-1 pt-1 sm:pt-2">
                  <p className="text-sm sm:text-lg font-semibold text-gray-800 mb-1">
                    {reviewQuestion.ques}
                  </p>
                  <p className="text-xs sm:text-base font-medium text-gray-600">
                    {reviewQuestion.ques_hi}
                  </p>
                </div>
                {isCorrect ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : userAnswer === null ? (
                  <span className="flex items-center gap-1 text-amber-600 font-bold flex-shrink-0 text-xs sm:text-sm">
                    Skipped
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 font-bold flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                {reviewQuestion.options.map((option, optIndex) => {
                  const isUserAnswer = userAnswer === optIndex;
                  const isCorrectAnswer = reviewQuestion.correct === optIndex;
                  
                  return (
                    <div
                      key={optIndex}
                      className={`p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                        isCorrectAnswer
                          ? 'border-green-500 bg-green-50'
                          : isUserAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className={`flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-md sm:rounded-lg font-bold text-xs sm:text-base ${
                          isCorrectAnswer
                            ? 'bg-green-500 text-white'
                            : isUserAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <div className={`flex-1 ${
                          isCorrectAnswer
                            ? 'text-green-800 font-semibold'
                            : isUserAnswer
                            ? 'text-red-800'
                            : 'text-gray-700'
                        }`}>
                          <div className="text-xs sm:text-base mb-0.5">
                            {option.en}
                          </div>
                          <div className="text-[10px] sm:text-sm text-gray-600">
                            {option.hi}
                          </div>
                        </div>
                        {isCorrectAnswer && (
                          <span className="flex items-center gap-1 text-green-700 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Correct
                          </span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="flex items-center gap-1 text-red-700 font-bold text-sm bg-red-100 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Go to Question Button - Bottom Right */}
              <div className="flex justify-end mt-4 sm:mt-6">
                <button
                  onClick={() => setShowReviewPalette(true)}
                  className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors"
                >
                  Go to Question
                </button>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Review Question Palette Drawer */}
        {showReviewPalette && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowReviewPalette(false)}
          >
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl h-[30vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex items-center justify-center py-2 border-b">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="text-base font-bold text-gray-800">Go to Question ({filteredQuestions.length})</h3>
                <button
                  onClick={() => setShowReviewPalette(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Question Grid - Show All Questions */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                  {exam && exam.paperData.questions.map((question, index) => {
                    const answer = answers[index];
                    const isCurrentQuestion = filteredQuestions[reviewQuestionIndex]?.index === index;
                    const isCorrectAnswer = answer === question.correct;
                    const isWrongAnswer = answer !== null && !isCorrectAnswer;
                    const isSkipped = answer === null;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          // Find this question's index in the filtered list
                          const filteredIndex = filteredQuestions.findIndex(item => item.index === index);
                          if (filteredIndex !== -1) {
                            setReviewQuestionIndex(filteredIndex);
                          }
                          setShowReviewPalette(false);
                        }}
                        className={`h-8 rounded-md font-semibold transition-all text-xs ${
                          isCurrentQuestion
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-300'
                            : isCorrectAnswer
                            ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-400'
                            : isWrongAnswer
                            ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 border border-red-400'
                            : 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border border-amber-400'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b-2 border-blue-100">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all group"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-gray-800 truncate">{exam.examData.examName.replace(/_/g, ' ').toUpperCase()}</h1>
                <p className="text-xs text-gray-500">Q {currentQuestionIndex + 1}/{totalQuestions} • {answeredCount} answered</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-2 sm:px-3 py-1 rounded-lg border border-blue-200">
                <div className="text-[9px] text-gray-600 font-medium">Time</div>
                <div className={`text-sm sm:text-base font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              {answeredCount > 0 && (
                <button
                  onClick={handleSubmitClick}
                  className="px-3 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-sm"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto p-3 sm:p-6 pb-20 lg:pb-6">
        <div className="flex gap-6 items-start">
          {/* Left Column: Question */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 h-full flex flex-col">
              {/* Question */}
              <div className="flex-1 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <span className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg sm:text-xl shadow-lg">
                    {currentQuestionIndex + 1}
                  </span>
                  <div className="flex-1 pt-2 sm:pt-3">
                    <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-2">
                      {currentQuestion.ques}
                    </h2>
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-600">
                      {currentQuestion.ques_hi}
                    </h2>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = currentQuestion.correct === index;
                    const showCorrectAnswer = selectedAnswer !== null;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ${
                          showCorrectAnswer && isCorrect
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                            : showCorrectAnswer && isSelected && !isCorrect
                            ? 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg'
                            : isSelected
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl font-bold text-base sm:text-lg ${
                            showCorrectAnswer && isCorrect
                              ? 'bg-green-500 text-white shadow-lg'
                              : showCorrectAnswer && isSelected && !isCorrect
                              ? 'bg-red-500 text-white shadow-lg'
                              : isSelected
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <div className={`flex-1 ${
                            showCorrectAnswer && isCorrect
                              ? 'text-green-800 font-semibold'
                              : showCorrectAnswer && isSelected && !isCorrect
                              ? 'text-red-800'
                              : 'text-gray-700'
                          }`}>
                            <div className="text-sm sm:text-base font-medium mb-1">
                              {option.en}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {option.hi}
                            </div>
                          </div>
                          {showCorrectAnswer && isCorrect && (
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {showCorrectAnswer && isSelected && !isCorrect && (
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

               
              </div>

              {/* Navigation */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    ← Previous
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-sm sm:text-base"
                  >
                    {currentQuestionIndex === totalQuestions - 1 ? 'Submit Exam' : 'Next →'}
                  </button>
                </div>

                {/* Mobile: Go To Question Link */}
                <div className="lg:hidden flex justify-end">
                  <button
                    onClick={() => setShowMobilePalette(true)}
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors"
                  >
                    Go To Question
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Question Palette (Desktop Only) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24 flex flex-col" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2 flex-1 overflow-y-auto pr-2 pb-2" style={{ scrollbarWidth: 'thin' }}>
                {exam.paperData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className={`h-10 rounded-lg font-semibold transition-all text-sm ${
                      index === currentQuestionIndex
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                        : answers[index] !== null
                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border-2 border-green-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t space-y-1.5 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-md"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-5 bg-gray-100 rounded-md"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Question Palette Drawer (Mobile Only) */}
      {showMobilePalette && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowMobilePalette(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl h-[30vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex items-center justify-center py-2 border-b">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="text-base font-bold text-gray-800">Question Palette</h3>
              <button
                onClick={() => setShowMobilePalette(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Question Grid */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {exam && exam.paperData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleQuestionJump(index);
                      setShowMobilePalette(false);
                    }}
                    className={`h-8 rounded-md font-semibold transition-all text-xs ${
                      index === currentQuestionIndex
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md'
                        : answers[index] !== null
                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-400'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Submit Exam?</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Are you sure you want to submit the exam? You have answered <strong>{answers.filter(a => a !== null).length}</strong> out of <strong>{totalQuestions}</strong> questions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
