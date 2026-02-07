'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { Question, Exam } from '@/lib/types';
import { departmentCache } from '@/lib/departmentCache';

interface UseExamDataProps {
  examId: string;
  deptSlug: string | null;
}

interface UseExamDataReturn {
  exam: Exam | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
  questionsLoading: boolean;
  questionsPrefetched: boolean;
  loadQuestions: () => Promise<Question[]>;
  fetchPracticeAnswers: () => Promise<Map<number, number>>;
}

/**
 * Hook to manage exam data fetching including:
 * - Resolving department slug to departmentId
 * - Fetching exam/paper details
 * - Prefetching questions
 */
export function useExamData({ examId, deptSlug }: UseExamDataProps): UseExamDataReturn {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsPrefetched, setQuestionsPrefetched] = useState(false);
  
  const questionsCache = useRef<Question[]>([]);
  const hasFetchedExam = useRef(false);

  // Transform API question format to our format
  const transformQuestions = useCallback((apiQuestions: any[]): Question[] => {
    return apiQuestions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      details: q.details,
      correctAnswer: q.correctAnswer
    }));
  }, []);

  // Resolve department slug to departmentId
  const resolveDepartmentId = useCallback(async (slug: string): Promise<string | null> => {
    // Special handling for 'general' slug
    if (slug.toLowerCase() === 'general') {
      const cachedGeneralDeptId = departmentCache.getGeneralDeptId();
      if (cachedGeneralDeptId) {
        return cachedGeneralDeptId;
      }
      return null; // Will need to search all departments
    }

    // Try cache first
    const cachedDept = departmentCache.findDepartment(slug);
    if (cachedDept) {
      return cachedDept.departmentId || cachedDept.id;
    }

    // Fetch from API
    try {
      const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.statusText}`);
      }

      const data = await response.json();
      const departments = data.data || [];

      // Cache for future use
      departmentCache.set({ departments });

      const dept = departments.find((d: any) =>
        d.slug === slug || d.id === slug || d.departmentId === slug
      );

      return dept ? (dept.departmentId || dept.id) : null;
    } catch (err) {
      console.error('Failed to resolve department:', err);
      return null;
    }
  }, []);

  // Find paper by examId in a department
  const findPaperInDepartment = useCallback(async (departmentId: string): Promise<any | null> => {
    try {
      const response = await fetch(API_ENDPOINTS.PAPERS(departmentId));
      if (!response.ok) return null;

      const data = await response.json();
      const papers = data.data?.papers || [];

      return papers.find((p: any) =>
        p.paperId === examId || p._id === examId || p.id === examId
      ) || null;
    } catch {
      return null;
    }
  }, [examId]);

  // Search all departments for the paper (fallback)
  const searchAllDepartments = useCallback(async (): Promise<{ paper: any; departmentId: string } | null> => {
    const cached = departmentCache.get();
    let departments = cached?.departments || [];

    if (departments.length === 0) {
      try {
        const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        departments = data.data || [];
      } catch {
        return null;
      }
    }

    for (const dept of departments) {
      const deptId = dept.departmentId || dept.id;
      const paper = await findPaperInDepartment(deptId);
      if (paper) {
        return { paper, departmentId: deptId };
      }
    }

    return null;
  }, [findPaperInDepartment]);

  // Prefetch questions
  const prefetchQuestions = useCallback(async (departmentId: string, paperId: string) => {
    try {
      setQuestionsLoading(true);
      const response = await fetch(API_ENDPOINTS.PAPER_QUESTIONS(departmentId, paperId));

      if (!response.ok) throw new Error('Failed to prefetch questions');

      const data = await response.json();
      if (data.success && data.data?.questions) {
        const transformed = transformQuestions(data.data.questions);
        questionsCache.current = transformed;
        setQuestionsPrefetched(true);
      }
    } catch (err) {
      console.error('Error prefetching questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  }, [transformQuestions]);

  // Load questions (uses cache if available)
  const loadQuestions = useCallback(async (): Promise<Question[]> => {
    if (questionsPrefetched && questionsCache.current.length > 0) {
      setQuestions(questionsCache.current);
      return questionsCache.current;
    }

    if (!exam?.departmentId || !exam?.paperId) {
      throw new Error('Missing department or paper information');
    }

    setQuestionsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.PAPER_QUESTIONS(exam.departmentId, exam.paperId));
      if (!response.ok) throw new Error('Failed to load questions');

      const data = await response.json();
      if (data.success && data.data?.questions) {
        const transformed = transformQuestions(data.data.questions);
        setQuestions(transformed);
        return transformed;
      }
      throw new Error('No questions found');
    } finally {
      setQuestionsLoading(false);
    }
  }, [exam, questionsPrefetched, transformQuestions]);

  // Fetch practice mode answers
  const fetchPracticeAnswers = useCallback(async (): Promise<Map<number, number>> => {
    if (!exam?.departmentId || !exam?.paperId) {
      return new Map();
    }

    try {
      const response = await fetch(API_ENDPOINTS.PAPER_ANSWERS(exam.departmentId, exam.paperId));
      if (!response.ok) return new Map();

      const data = await response.json();
      if (data.success && data.data?.answers) {
        const answersMap = new Map<number, number>();
        data.data.answers.forEach((ans: { id: number; correct: number }) => {
          answersMap.set(ans.id, ans.correct);
        });
        return answersMap;
      }
    } catch (err) {
      console.error('Error fetching practice answers:', err);
    }

    return new Map();
  }, [exam]);

  // Fetch exam details on mount
  useEffect(() => {
    if (hasFetchedExam.current) return;
    hasFetchedExam.current = true;

    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        let paper: any = null;
        let departmentId: string | null = null;

        // Try to resolve department and find paper
        if (deptSlug) {
          departmentId = await resolveDepartmentId(deptSlug);
          if (departmentId) {
            paper = await findPaperInDepartment(departmentId);
          }
        }

        // Fallback: search all departments
        if (!paper) {
          const result = await searchAllDepartments();
          if (result) {
            paper = result.paper;
            departmentId = result.departmentId;
          }
        }

        if (!paper || !departmentId) {
          throw new Error('Exam paper not found');
        }

        // Handle general papers
        const isGeneralPaper = paper.department?.toLowerCase() === 'general';
        let finalDepartmentId = departmentId;

        if (isGeneralPaper) {
          try {
            const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
            if (response.ok) {
              const data = await response.json();
              const departments = data.data || [];
              const generalDept = departments.find((d: any) =>
                d.name?.toLowerCase() === 'general' || d.slug?.toLowerCase() === 'general'
              );
              if (generalDept) {
                finalDepartmentId = generalDept.departmentId || generalDept.id;
                departmentCache.set({ departments });
              }
            }
          } catch (err) {
            console.error('Failed to fetch general department:', err);
          }
        }

        // Create exam object
        const examData: Exam = {
          id: paper.paperId || paper._id,
          departmentId: finalDepartmentId,
          paperId: paper.paperId || paper._id,
          name: paper.name,
          description: paper.description,
          duration: paper.duration || 90,
          totalQuestions: paper.totalQuestions || 100,
          passingMarks: paper.passMarks || 40,
          passingPercentage: paper.passingPercentage,
          negativeMarking: paper.negativeMarking || 0.33,
          studentsAttempted: Math.floor(Math.random() * 5000) + 1000
        };

        setExam(examData);
        
        // Start prefetching questions
        prefetchQuestions(finalDepartmentId, paper.paperId || paper._id);

      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load exam');
        console.error('Error fetching exam details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId, deptSlug, resolveDepartmentId, findPaperInDepartment, searchAllDepartments, prefetchQuestions]);

  return {
    exam,
    questions,
    loading,
    error,
    questionsLoading,
    questionsPrefetched,
    loadQuestions,
    fetchPracticeAnswers
  };
}
