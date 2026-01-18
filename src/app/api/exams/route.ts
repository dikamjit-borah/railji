import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Exam from '@/models/Exam';

export async function GET() {
  try {
    await connectDB();
    
    const exams = await Exam.find({ status: 'active' }).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exams',
      },
      { status: 500 }
    );
  }
}
