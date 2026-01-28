import { NextResponse } from 'next/server';
import examData from '@/data/exams.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
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

  return NextResponse.json({
    success: true,
    data: {
      examId: exam.id,
      questions: questions
    }
  });
}
