import { NextResponse } from 'next/server';
import examData from '@/data/exams.json';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const { examId } = await params;
  
  // Find the exam in the data
  const exam = examData.exams.find(e => e.id === examId);
  
  if (!exam) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'EXAM_NOT_FOUND',
        message: 'The requested exam does not exist.'
      }
    }, { status: 404 });
  }

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid request body.'
      }
    }, { status: 400 });
  }

  const { answers, timeTaken } = body;

  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Answers array is required.'
      }
    }, { status: 400 });
  }

  // Get questions for this exam
  const questions = (examData.questions as any)[examId] || [];
  
  if (questions.length === 0) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NO_QUESTIONS',
        message: 'No questions found for this exam.'
      }
    }, { status: 404 });
  }

  // Calculate score
  const negativeMarking = -1/3;
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let skipped = 0;
  
  const breakdown = questions.map((question: any, index: number) => {
    const userAnswer = answers[index];
    const correctAnswer = question.correctAnswer;
    
    if (userAnswer === null || userAnswer === undefined) {
      skipped++;
      return {
        questionId: question.id,
        userAnswer: null,
        correctAnswer,
        isCorrect: false,
        isSkipped: true
      };
    }
    
    if (userAnswer === correctAnswer) {
      score += 1;
      correctAnswers++;
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer,
        isCorrect: true,
        isSkipped: false
      };
    } else {
      score += negativeMarking;
      wrongAnswers++;
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer,
        isCorrect: false,
        isSkipped: false
      };
    }
  });

  // Round score to 2 decimal places
  score = Math.round(score * 100) / 100;

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100 * 100) / 100;
  const passingMarks = Math.ceil(totalQuestions * 0.4);
  const passed = score >= passingMarks;

  return NextResponse.json({
    success: true,
    data: {
      examId: exam.id,
      score,
      totalQuestions,
      percentage,
      passed,
      correctAnswers,
      wrongAnswers,
      skipped,
      timeTaken: timeTaken || 0,
      attemptNumber: 1, // This would come from user data in production
      breakdown
    }
  });
}
