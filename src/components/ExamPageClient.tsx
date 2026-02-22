'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { ExamMode } from '@/lib/examTypes';
import { getExamAttemptCount, getBestScore } from '@/lib/examStorage';
import { useExamTimer, useExamData, useExamState, useExamSubmission } from '@/hooks';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './common/ErrorScreen';
import ExamInstructions from './exam/ExamInstructions';
import ExamQuestion from './exam/ExamQuestion';
import QuestionPalette from './exam/QuestionPalette';
import SubmitConfirmation from './exam/SubmitConfirmation';
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
  const [examMode, setExamMode] = useState<ExamMode | null>(null);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Map<number, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Refs for scroll management
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const questionWrapperRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

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
    isActive: hasStarted,
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
    if (hasStarted) {
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
  }, [examState.currentIndex, hasStarted]);

  // Prevent accidental navigation during exam
  useEffect(() => {
    if (!hasStarted) return;

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowSubmitConfirm(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Allow navigation if exam is being submitted
      if (isSubmittingRef.current) {
        return;
      }
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
  }, [hasStarted]);

  // Handlers
  async function handleStartExam(mode: ExamMode) {
    setExamMode(mode);
    setIsStarting(true);
    
    try {
      let examQuestions = questions;
      
      // Check if questions are already prefetched or loaded
      if (questionsPrefetched && questions.length === 0) {
        // Questions are prefetched but not in state yet, load them
        examQuestions = await loadQuestions();
      } else if (questions.length > 0) {
        // Questions already in state, use them
        examQuestions = questions;
      } else {
        // Questions not available, need to fetch
        examQuestions = await loadQuestions();
      }
      
      if (!examQuestions || examQuestions.length === 0) {
        throw new Error('No questions available');
      }
      
      // Initialize exam with loaded questions
      examState.initializeExam(examQuestions.length);
      setHasStarted(true);
      
      // Track exam start in background (non-blocking)
      if (exam?.paperId && exam?.departmentId) {
        const userId = 'pramoduser';
        
        fetch(API_ENDPOINTS.START_EXAM, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            paperId: exam.paperId,
            departmentId: exam.departmentId,
          }),
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(startData => {
          if (startData?.success && startData.data?.examId) {
            setActiveExamId(startData.data.examId);
          }
        }).catch(err => {
          console.error('Error tracking exam start:', err);
        });
      }
      
      // Fetch practice answers in background if needed
      if (mode === 'practice') {
        fetchPracticeAnswers().then(answers => {
          if (answers) {
            setPracticeAnswers(answers);
          }
        }).catch(err => {
          console.error('Error fetching practice answers:', err);
        });
      }
    } catch (err) {
      console.error('Error starting exam:', err);
      alert('Failed to start exam. Please try again.');
    } finally {
      setIsStarting(false);
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
        setIsSubmitting(true); // Set loading state
        
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
            // Set flag to allow navigation without warning
            isSubmittingRef.current = true;
            
            // Navigate to result page with examId
            window.location.href = `/exam/result/${submitData.data.examId}`;
            return;
          }
        }
        
        // If we reach here, submission failed
        throw new Error('Failed to submit exam');
      } catch (err) {
        console.error('Error submitting exam:', err);
        setIsSubmitting(false); // Reset loading state on error
        alert('Failed to submit exam. Please try again.');
        setShowSubmitConfirm(false);
        return;
      }
    }

    // If exam or activeExamId is missing, show error
    setIsSubmitting(false); // Reset loading state
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
    return <LoadingScreen 
      isLoading={true} 
      message="Loading exam details..." 
      animationPath="/animation/Trainbasic.lottie/a/Scene.json"
    />;
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
        isStarting={isStarting}
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
          isSubmitting={isSubmitting}
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
