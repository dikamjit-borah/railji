'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { Question, Exam } from '@/lib/types';
import { saveExamAttempt, getExamAttemptCount, getBestScore } from '@/lib/examStorage';
import { departmentCache } from '@/lib/departmentCache';
import LoadingState from './common/LoadingState';
import ErrorScreen from './common/ErrorScreen';
import ExamInstructions from './exam/ExamInstructions';
import ExamQuestion from './exam/ExamQuestion';
import QuestionPalette from './exam/QuestionPalette';
import ExamResult from './exam/ExamResult';
import SubmitConfirmation from './exam/SubmitConfirmation';

interface ExamPageClientProps {
  examId: string;
}

export default function ExamPageClient({ examId }: ExamPageClientProps) {
  const searchParams = useSearchParams();
  const deptSlugFromUrl = searchParams.get('dept'); // This is now a slug, not departmentId

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
  const [lockedQuestions, setLockedQuestions] = useState<boolean[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<Map<number, number>>(new Map());
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  
  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsPrefetched, setQuestionsPrefetched] = useState(false);
  const questionsCache = useRef<Question[]>([]);
  const hasFetchedExam = useRef(false);
  
  // Result state from API
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    correctAnswers: number;
    wrongAnswers: number;
    skipped: number;
  } | null>(null);

  // Helper to prefetch questions
  const prefetchQuestions = useCallback(async (departmentId: string, paperId: string) => {
    try {
      setQuestionsLoading(true);
      
      const questionsResponse = await fetch(API_ENDPOINTS.PAPER_QUESTIONS(departmentId, paperId));
      
      if (!questionsResponse.ok) {
        throw new Error('Failed to prefetch questions');
      }
      
      const questionsData = await questionsResponse.json();
      
      if (questionsData.success && questionsData.data && questionsData.data.length > 0) {
        const transformedQuestions: Question[] = questionsData.data[0].questions.map((q: any) => ({
          id: q.id,
          questions: q.questions,
          options: q.options,
          details: q.details,
          correctAnswer: q.correctAnswer
        }));
        
        questionsCache.current = transformedQuestions;
        setQuestionsPrefetched(true);
      }
    } catch (err) {
      console.error('Error prefetching questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  // Fetch exam details and prefetch questions
  useEffect(() => {
    // Skip if we've already fetched (prevents refetching on state changes like review mode)
    if (hasFetchedExam.current) return;
    
    const fetchExamDetails = async () => {
      hasFetchedExam.current = true;
      try {
        setLoading(true);
        setError(null);
        
        let foundPaper: any = null;
        let foundDepartmentId: string | null = null;
        
        // If department slug is provided in URL, resolve it to departmentId
        if (deptSlugFromUrl) {
          // Special handling for 'general' slug
          if (deptSlugFromUrl.toLowerCase() === 'general') {
            const generalDeptId = departmentCache.getGeneralDeptId();
            if (generalDeptId) {
              foundDepartmentId = generalDeptId;
              console.log('ExamPage - Using generalDeptId from cache for general slug:', foundDepartmentId);
            } else {
              // Fetch departments to get generalDeptId
              console.log('ExamPage - General slug but no cache, fetching departments');
              const deptsResponse = await fetch(API_ENDPOINTS.DEPARTMENTS);
              
              if (deptsResponse.ok) {
                const deptsData = await deptsResponse.json();
                const departments = deptsData.data?.departments || [];
                const metadata = deptsData.data?.metadata || {};
                const fetchedGeneralDeptId = metadata.general?.departmentId;
                
                if (fetchedGeneralDeptId) {
                  foundDepartmentId = fetchedGeneralDeptId;
                  console.log('ExamPage - Fetched generalDeptId for general slug:', foundDepartmentId);
                  
                  // Cache for future use
                  departmentCache.set({
                    departments,
                    metadata: {
                      generalDeptId: fetchedGeneralDeptId,
                      ...metadata
                    }
                  });
                }
              }
            }
          } else {
            // Try to get department from cache first
            const cachedDept = departmentCache.findDepartment(deptSlugFromUrl);
            
            if (cachedDept) {
              foundDepartmentId = cachedDept.departmentId || cachedDept.id;
              console.log('ExamPage - Resolved slug to deptId from cache:', deptSlugFromUrl, '->', foundDepartmentId);
            } else {
              // Not in cache, fetch departments to resolve slug
              console.log('ExamPage - Slug not in cache, fetching departments to resolve');
              const deptsResponse = await fetch(API_ENDPOINTS.DEPARTMENTS);
              
              if (deptsResponse.ok) {
                const deptsData = await deptsResponse.json();
                const departments = deptsData.data?.departments || [];
                
                // Cache for future use
                const metadata = deptsData.data?.metadata || {};
                departmentCache.set({
                  departments,
                  metadata: {
                    generalDeptId: metadata.general?.departmentId,
                    ...metadata
                  }
                });
                
                const dept = departments.find((d: any) => 
                  d.slug === deptSlugFromUrl || 
                  d.id === deptSlugFromUrl ||
                  d.departmentId === deptSlugFromUrl
                );
                
                if (dept) {
                  foundDepartmentId = dept.departmentId || dept.id;
                  console.log('ExamPage - Resolved slug to deptId from API:', deptSlugFromUrl, '->', foundDepartmentId);
                }
              }
            }
          }
          
          // If we resolved the slug to departmentId, fetch papers directly
          if (foundDepartmentId) {
            const papersResponse = await fetch(API_ENDPOINTS.PAPERS(foundDepartmentId));
            
            if (papersResponse.ok) {
              const papersData = await papersResponse.json();
              const papers = papersData.data?.papers || [];
              
              foundPaper = papers.find((p: any) => 
                p.paperId === examId || 
                p._id === examId ||
                p.id === examId
              );
            }
          }
        }
        
        // Fallback: search through cached or fetch departments (only for direct URL access/bookmarked links without ?dept parameter)
        // Normal flow from department page will always have dept parameter, so this rarely executes
        if (!foundPaper) {
          console.log('ExamPage - No dept param, checking cache first');
          
          // Try cache first
          const cached = departmentCache.get();
          let departments = cached?.departments || [];
          
          // Only fetch from API if cache is empty
          if (departments.length === 0) {
            console.log('ExamPage - Cache miss, fetching departments from API');
            const deptsResponse = await fetch(API_ENDPOINTS.DEPARTMENTS);
            
            if (!deptsResponse.ok) {
              throw new Error(`Failed to fetch departments: ${deptsResponse.statusText}`);
            }
            
            const deptsData = await deptsResponse.json();
            departments = deptsData.data?.departments || [];
          } else {
            console.log('ExamPage - Using cached departments, no API call');
          }
          
          for (const dept of departments) {
            const deptId = dept.departmentId || dept.id;
            try {
              const papersResponse = await fetch(API_ENDPOINTS.PAPERS(deptId));
              if (papersResponse.ok) {
                const papersData = await papersResponse.json();
                const papers = papersData.data?.papers || [];
                
                const paper = papers.find((p: any) => 
                  p.paperId === examId || 
                  p._id === examId ||
                  p.id === examId
                );
                
                if (paper) {
                  foundPaper = paper;
                  foundDepartmentId = deptId;
                  break;
                }
              }
            } catch (err) {
              console.log(`Error searching in department ${deptId}:`, err);
            }
          }
        }
        
        if (!foundPaper || !foundDepartmentId) {
          throw new Error('Exam paper not found');
        }
        
        // Check if this is a general paper and use generalDeptId from cache if so
        const isGeneralPaper = foundPaper.department?.toLowerCase() === 'general';
        let finalDepartmentId = foundDepartmentId;
        
        if (isGeneralPaper) {
          const generalDeptId = departmentCache.getGeneralDeptId();
          if (generalDeptId) {
            console.log('ExamPage - General paper detected, using generalDeptId from cache:', generalDeptId);
            finalDepartmentId = generalDeptId;
          } else {
            console.warn('ExamPage - General paper detected but no generalDeptId in cache, fetching departments');
            // Fetch departments to get generalDeptId
            try {
              const deptsResponse = await fetch(API_ENDPOINTS.DEPARTMENTS);
              if (deptsResponse.ok) {
                const deptsData = await deptsResponse.json();
                const metadata = deptsData.data?.metadata || {};
                const fetchedGeneralDeptId = metadata.general?.departmentId;
                
                if (fetchedGeneralDeptId) {
                  finalDepartmentId = fetchedGeneralDeptId;
                  console.log('ExamPage - Fetched generalDeptId from API:', fetchedGeneralDeptId);
                  
                  // Update cache
                  departmentCache.set({
                    departments: deptsData.data?.departments || [],
                    metadata: {
                      generalDeptId: fetchedGeneralDeptId,
                      ...metadata
                    }
                  });
                }
              }
            } catch (err) {
              console.error('ExamPage - Failed to fetch generalDeptId:', err);
            }
          }
        }
        
        // Set exam data
        const examData: Exam = {
          id: foundPaper.paperId || foundPaper._id,
          departmentId: finalDepartmentId,
          paperId: foundPaper.paperId || foundPaper._id,
          name: foundPaper.name,
          description: foundPaper.description,
          duration: foundPaper.duration || 90,
          totalQuestions: foundPaper.totalQuestions || 100,
          passingMarks: foundPaper.passMarks || 40,
          passingPercentage: foundPaper.passingPercentage,
          negativeMarking: foundPaper.negativeMarking || 0.33,
          studentsAttempted: Math.floor(Math.random() * 5000) + 1000
        };
        
        setExam(examData);
        setTimeRemaining(examData.duration * 60);
        
        // Start prefetching questions (use finalDepartmentId for general papers)
        prefetchQuestions(finalDepartmentId, foundPaper.paperId || foundPaper._id);
        
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load exam');
        console.error('Error fetching exam details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, deptSlugFromUrl]); // prefetchQuestions removed - it's stable and called inside fetchExamDetails

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
      // Call start exam API to track exam start
      if (exam?.paperId && exam?.departmentId) {
        try {
          const userId = 'pramoduser';
          
          const startResponse = await fetch(API_ENDPOINTS.START_EXAM, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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
              console.log('Exam start tracked successfully, examId:', startData.data.examId);
            }
          }
        } catch (err) {
          // Non-blocking error - continue even if tracking fails
          console.error('Error tracking exam start:', err);
        }
      }

      // Fetch answers if practice mode
      if (mode === 'practice' && exam?.departmentId && exam?.paperId) {
        try {
          const answersResponse = await fetch(API_ENDPOINTS.PAPER_ANSWERS(exam.departmentId, exam.paperId));
          if (answersResponse.ok) {
            const answersData = await answersResponse.json();
            if (answersData.success && answersData.data && answersData.data.length > 0) {
              const answersMap = new Map<number, number>();
              answersData.data[0].answers.forEach((ans: { id: number; correct: number }) => {
                answersMap.set(ans.id, ans.correct);
              });
              setPracticeAnswers(answersMap);
            }
          }
        } catch (err) {
          console.error('Error fetching practice answers:', err);
        }
      }

      // Use cached questions if available, otherwise fetch now
      if (questionsPrefetched && questionsCache.current.length > 0) {
        setQuestions(questionsCache.current);
        setAnswers(new Array(questionsCache.current.length).fill(null));
        setMarkedForReview(new Array(questionsCache.current.length).fill(false));
        setLockedQuestions(new Array(questionsCache.current.length).fill(false));
        setHasStarted(true);
        setVisitedQuestions(new Set([0])); // Mark first question as visited
      } else {
        // Questions weren't prefetched, fetch them now
        if (!exam?.departmentId || !exam?.paperId) {
          throw new Error('Missing department or paper information');
        }
        
        setQuestionsLoading(true);
        const questionsResponse = await fetch(API_ENDPOINTS.PAPER_QUESTIONS(exam.departmentId, exam.paperId));
        
        if (!questionsResponse.ok) {
          throw new Error('Failed to load questions');
        }
        
        const questionsData = await questionsResponse.json();
        
        if (questionsData.success && questionsData.data && questionsData.data.length > 0) {
          // Transform questions from API format to our format
          const transformedQuestions: Question[] = questionsData.data[0].questions.map((q: any) => ({
            id: q.id,
            questions: q.questions,
            options: q.options,
            details: q.details,
            correctAnswer: q.correctAnswer
          }));
          
          setQuestions(transformedQuestions);
          setAnswers(new Array(transformedQuestions.length).fill(null));
          setMarkedForReview(new Array(transformedQuestions.length).fill(false));
          setLockedQuestions(new Array(transformedQuestions.length).fill(false));
          setHasStarted(true);
          setVisitedQuestions(new Set([0]));
          
          // Fetch answers if practice mode and not already fetched
          if (mode === 'practice' && practiceAnswers.size === 0) {
            try {
              const answersResponse = await fetch(API_ENDPOINTS.PAPER_ANSWERS(exam.departmentId, exam.paperId));
              if (answersResponse.ok) {
                const answersData = await answersResponse.json();
                if (answersData.success && answersData.data && answersData.data.length > 0) {
                  const answersMap = new Map<number, number>();
                  answersData.data[0].answers.forEach((ans: { id: number; correct: number }) => {
                    answersMap.set(ans.id, ans.correct);
                  });
                  setPracticeAnswers(answersMap);
                }
              }
            } catch (err) {
              console.error('Error fetching practice answers:', err);
            }
          }
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
    // In practice mode, lock the question after selecting an answer
    if (examMode === 'practice' && selectedAnswer === null) {
      setSelectedAnswer(optionIndex);
      // Lock this question in practice mode once answer is selected
      const newLocked = [...lockedQuestions];
      newLocked[currentQuestionIndex] = true;
      setLockedQuestions(newLocked);
    } else if (examMode !== 'practice') {
      // In exam mode, allow toggling of answers
      if (selectedAnswer === optionIndex) {
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(optionIndex);
      }
    }
    // In practice mode, if already answered (locked), do nothing
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
    
    // Calculate score client-side
    const timeTaken = (exam?.duration || 0) * 60 - timeRemaining;
    const negativeMarking = -1/3;
    
    let score = 0;
    let correctAnswersCount = 0;
    let wrongAnswersCount = 0;
    let skippedCount = 0;
    
    newAnswers.forEach((answer, index) => {
      if (answer === null) {
        skippedCount++;
      } else if (answer === questions[index]?.correctAnswer) {
        score += 1;
        correctAnswersCount++;
      } else {
        score += negativeMarking;
        wrongAnswersCount++;
      }
    });
    
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= 40; // 40% passing threshold
    
    // Store submission result
    setSubmissionResult({
      score: Math.round(score * 100) / 100, // Round to 2 decimal places
      percentage,
      passed,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,
      skipped: skippedCount
    });
    
    // Call submit API
    if (exam && activeExamId) {
      try {
        const attemptedQuestions = newAnswers.filter(a => a !== null).length;
        const unattemptedQuestions = totalQuestions - attemptedQuestions;
        
        // Format responses array
        const responses = questions.map((question, index) => ({
          questionId: question.id,
          selectedOption: newAnswers[index] !== null ? newAnswers[index]! : -1, // Use -1 for unattempted
          isFlagged: markedForReview[index] || false
        }));
        
        const submitResponse = await fetch(API_ENDPOINTS.SUBMIT_EXAM, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            examId: activeExamId,
            userId: 'pramoduser',
            paperId: exam.paperId,
            departmentId: exam.departmentId,
            attemptedQuestions,
            unattemptedQuestions,
            responses
          }),
        });
        
        if (submitResponse.ok) {
          const submitData = await submitResponse.json();
          console.log('Exam submitted successfully:', submitData);
        } else {
          console.error('Failed to submit exam:', await submitResponse.text());
        }
      } catch (err) {
        console.error('Error submitting exam:', err);
      }
    }
    
    // Save attempt to localStorage
    if (exam) {
      saveExamAttempt({
        examId: exam.id,
        examName: exam.name,
        date: new Date().toISOString(),
        score: Math.round(score * 100) / 100,
        totalQuestions,
        percentage,
        timeTaken,
        passed,
        correctAnswers: correctAnswersCount,
        wrongAnswers: wrongAnswersCount,
        skipped: skippedCount,
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
    return <LoadingState message="Loading exam details..." />;
  }

  // Error state
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

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const totalQuestions = exam.totalQuestions;

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
    // submissionResult is always set when showResult is true
    const score = submissionResult?.score || 0;
    const percentage = submissionResult?.percentage || 0;
    const passed = submissionResult?.passed || false;
    const correctAnswers = submissionResult?.correctAnswers || 0;
    const wrongAnswers = submissionResult?.wrongAnswers || 0;
    const skipped = submissionResult?.skipped || 0;
    
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
                isLocked={examMode === 'practice' && lockedQuestions[currentQuestionIndex]}
                correctAnswer={examMode === 'practice' && lockedQuestions[currentQuestionIndex] ? practiceAnswers.get(currentQuestion.id) : undefined}
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
