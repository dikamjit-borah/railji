'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { ExamMode } from '@/lib/examTypes';
import { getExamAttemptCount, getBestScore } from '@/lib/examStorage';
import { useExamTimer, useExamData, useExamState, useExamSubmission } from '@/hooks';
import LoadingState from './common/LoadingState';
import ErrorScreen from './common/ErrorScreen';
import ExamInstructions from './exam/ExamInstructions';
import ExamQuestion from './exam/ExamQuestion';
import QuestionPalette from './exam/QuestionPalette';
import ExamResult from './exam/ExamResult';
import SubmitConfirmation from './exam/SubmitConfirmation';
import QuestionReview from './QuestionReview';
import ExamHeader from './exam/ExamHeader';
import ExamActionBar from './exam/ExamActionBar';

interface ExamPageClientProps {
  examId: string;
}

export default function ExamPageClient({ examId }: ExamPageClientProps) {
  const searchParams = useSearchParams();
  const deptSlugFromUrl = searchParams.get('dept');

  // Core state
  const [hasStarted, setHasStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [examMode, setExamMode] = useState<ExamMode | null>(null);
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Map<number, number>>(new Map());

  // Refs for scroll management
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const questionWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch exam data
  const {
    exam,
    questions,
    loading,
    error,
    questionsLoading,
    questionsPrefetched,
    loadQuestions,
    fetchPracticeAnswers
  } = useExamData({ examId, deptSlug: deptSlugFromUrl });

  // Exam state management
  const examState = useExamState({ totalQuestions: questions.length });

  // Timer
  const timer = useExamTimer({
    initialTime: exam ? exam.duration * 60 : 0,
    isActive: hasStarted && !showResult,
    onTimeUp: handleSubmit
  });

  // Submission
  const submission = useExamSubmission({
    examId: exam?.id || '',
    examTitle: exam?.name || '',
    initialTime: exam ? exam.duration * 60 : 0,
    markingScheme: {
      correct: 1,
      incorrect: -1/3,
      unattempted: 0
    }
  });

  // Scroll to top when question changes
  useEffect(() => {
    if (hasStarted && !showResult) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTop = 0;
      }
      
      if (questionWrapperRef.current) {
        questionWrapperRef.current.scrollTop = 0;
      }
    }
  }, [examState.currentIndex, hasStarted, showResult]);

  // Prevent accidental navigation during exam
  useEffect(() => {
    if (!hasStarted || showResult) return;

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowSubmitConfirm(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasStarted, showResult]);

  // Handlers
  async function handleStartExam(mode: ExamMode) {
    setExamMode(mode);
    
    try {
      // Track exam start
      if (exam?.paperId && exam?.departmentId) {
        try {
          const userId = 'pramoduser';
          
          const startResponse = await fetch(API_ENDPOINTS.START_EXAM, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              paperId: exam.paperId,
              departmentId: exam.departmentId,
            }),
          });
          
          if (startResponse.ok) {
            const startData = await startResponse.json();
            if (startData.success && startData.data?.examId) {
              setActiveExamId(startData.data.examId);
            }
          }
        } catch (err) {
          console.error('Error tracking exam start:', err);
        }
      }

      // Load questions
      const loadedQuestions = await loadQuestions();
      if (loadedQuestions && loadedQuestions.length > 0) {
        examState.initializeExam(loadedQuestions.length);
        setHasStarted(true);

        // Fetch practice answers if needed
        if (mode === 'practice') {
          const answers = await fetchPracticeAnswers();
          if (answers) {
            setPracticeAnswers(answers);
          }
        }
      } else {
        throw new Error('No questions available');
      }
    } catch (err) {
      console.error('Error starting exam:', err);
      alert('Failed to start exam. Please try again.');
    }
  }

  async function handleSubmit() {
    examState.saveCurrentAnswer();
    
    const result = submission.calculateResult(
      questions,
      examState.answers,
      timer.timeRemaining
    );

    // Submit to API
    if (exam && activeExamId) {
      try {
        const responses = questions.map((question, index) => ({
          questionId: question.id,
          selectedOption: examState.answers[index] !== null ? examState.answers[index]! : -1,
          isFlagged: examState.markedForReview[index] || false
        }));
        
        const submitResponse = await fetch(API_ENDPOINTS.SUBMIT_EXAM, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examId: activeExamId,
            userId: 'pramoduser',
            paperId: exam.paperId,
            departmentId: exam.departmentId,
            attemptedQuestions: result.totalQuestions - result.skippedQuestions,
            unattemptedQuestions: result.skippedQuestions,
            responses
          }),
        });

        if (submitResponse.ok) {
          const submitData = await submitResponse.json();
          if (submitData.success && submitData.data?.examId) {
            // Remove beforeunload listener to prevent reload confirmation
            window.onbeforeunload = null;
            
            // Navigate to result page with examId
            window.location.href = `/exam/result/${submitData.data.examId}`;
            return;
          }
        }
        
        // If we reach here, submission failed
        throw new Error('Failed to submit exam');
      } catch (err) {
        console.error('Error submitting exam:', err);
        alert('Failed to submit exam. Please try again.');
        setShowSubmitConfirm(false);
        return;
      }
    }

    // If exam or activeExamId is missing, show error
    alert('Unable to submit exam. Please try again.');
    setShowSubmitConfirm(false);
  }

  function handleSelectAnswer(optionIndex: number) {
    examState.selectAnswer(optionIndex, examMode === 'practice');
  }

  function handleNextQuestion() {
    const moved = examState.goToNextQuestion();
    if (!moved) {
      // On last question, show submit confirmation
      setShowSubmitConfirm(true);
    }
  }

  function handlePreviousQuestion() {
    examState.goToPreviousQuestion();
  }

  function handleQuestionJump(index: number) {
    examState.goToQuestion(index);
    setShowMobilePalette(false);
  }

  // Render states
  if (loading) {
    return <LoadingState message="Loading exam details..." />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Error Loading Exam"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!exam) {
    return (
      <ErrorScreen
        title="Exam not found"
        message="The exam you're looking for doesn't exist."
        onRetry={undefined}
      />
    );
  }

  // Pre-exam instructions
  if (!hasStarted) {
    const attemptCount = getExamAttemptCount(examId);
    const bestScore = attemptCount > 0 ? getBestScore(examId) : null;

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

  // Post-exam result
  if (showResult) {
    const storedResult = submission.getStoredResult();
    
    if (!storedResult) {
      return <LoadingState message="Loading results..." />;
    }

    if (showQuestionReview) {
      return (
        <QuestionReview
          examName={exam.name}
          questions={questions}
          answers={examState.answers}
          markedForReview={examState.markedForReview}
          onBackToResult={() => setShowQuestionReview(false)}
        />
      );
    }

    return (
      <ExamResult
        exam={exam}
        questions={questions}
        answers={examState.answers}
        score={storedResult.score}
        percentage={storedResult.percentage}
        passed={storedResult.percentage >= 40}
        correctAnswers={storedResult.correctAnswers}
        wrongAnswers={storedResult.wrongAnswers}
        skipped={storedResult.skippedQuestions}
        timeTaken={storedResult.timeTaken}
        onReviewAnswers={() => setShowQuestionReview(true)}
      />
    );
  }

  // Active exam
  const currentQuestion = questions[examState.currentIndex];
  const isPracticeMode = examMode === 'practice';
  const isLocked = isPracticeMode && examState.lockedQuestions[examState.currentIndex];
  const correctAnswer = isPracticeMode && isLocked ? practiceAnswers.get(currentQuestion.id) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-orange-50/30 to-stone-100 flex flex-col">
      {/* Header */}
      <ExamHeader
        examName={exam.name}
        currentQuestionIndex={examState.currentIndex}
        totalQuestions={exam.totalQuestions}
        timeRemaining={timer.timeRemaining}
        answeredCount={examState.answeredCount}
        onShowPalette={() => setShowMobilePalette(true)}
        onSubmit={() => setShowSubmitConfirm(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex justify-center" ref={contentContainerRef}>
        <div className="w-full max-w-5xl p-3 sm:p-4 lg:p-6">
          <div className="w-full" ref={questionWrapperRef}>
            {/* Question */}
            <div className="mb-3 sm:mb-4">
              <ExamQuestion
                question={currentQuestion}
                questionIndex={examState.currentIndex}
                totalQuestions={exam.totalQuestions}
                selectedAnswer={examState.selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
                markedForReview={examState.markedForReview[examState.currentIndex]}
                onToggleMarkForReview={examState.toggleMarkForReview}
                onSubmit={() => setShowSubmitConfirm(true)}
                showSubmitButton={true}
                practiceMode={isPracticeMode}
                isLocked={isLocked}
                correctAnswer={correctAnswer}
              />
            </div>

            {/* Navigation */}
            <ExamActionBar
              currentQuestionIndex={examState.currentIndex}
              totalQuestions={exam.totalQuestions}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSubmit={() => setShowSubmitConfirm(true)}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation */}
      {showSubmitConfirm && (
        <SubmitConfirmation
          totalQuestions={exam.totalQuestions}
          answeredCount={examState.answeredCount}
          visitedCount={examState.visitedQuestions.size}
          skippedCount={examState.skippedCount}
          markedCount={examState.markedCount}
          answers={examState.answers}
          markedForReview={examState.markedForReview}
          visitedQuestions={examState.visitedQuestions}
          onSubmit={handleSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
          onQuestionJump={handleQuestionJump}
        />
      )}

      {/* Question Palette */}
      <QuestionPalette
        totalQuestions={exam.totalQuestions}
        currentQuestionIndex={examState.currentIndex}
        answers={examState.answers}
        markedForReview={examState.markedForReview}
        visitedQuestions={examState.visitedQuestions}
        onQuestionJump={handleQuestionJump}
        showMobile={showMobilePalette}
        onCloseMobile={() => setShowMobilePalette(false)}
      />
    </div>
  );
}
