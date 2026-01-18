import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Paper from '@/models/Paper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examName: string; department: string }> }
) {
  try {
    await connectDB();
    
    const { examName, department } = await params;
    
    // Get the latest paper for this exam and department
    const paper = await Paper.findOne({ examName, department })
      .sort({ createdAt: -1 })
      .lean();
    
    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paper not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: paper,
    });
  } catch (error) {
    console.error('Error fetching paper:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch paper',
      },
      { status: 500 }
    );
  }
}
