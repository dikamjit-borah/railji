import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examName: string }> }
) {
  try {
    await connectDB();
    
    const { examName } = await params;
    const exam = await Exam.findOne({ examName, status: 'active' });
    
    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Exam not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exam',
      },
      { status: 500 }
    );
  }
}
