import { NextResponse } from 'next/server';
import examData from '@/data/exams.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
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

  // Return exam details (without questions)
  return NextResponse.json({
    success: true,
    data: {
      id: exam.id,
      name: exam.name,
      description: exam.description,
      duration: exam.duration,
      totalQuestions: exam.totalQuestions,
      passingMarks: exam.passingMarks,
      passingPercentage: 40,
      negativeMarking: -0.33,
      instructions: [
        'You must complete this test in one session - make sure your internet is reliable.',
        '1 mark awarded for a correct answer. Negative marking of -0.33 for each wrong answer.',
        'More you give the correct answer more chance to win the badge.',
        'If you don\'t earn a badge this time, you can retake this test once more.'
      ],
      studentsAttempted: Math.floor(Math.random() * 20000) + 5000
    }
  });
}
