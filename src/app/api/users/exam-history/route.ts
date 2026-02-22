import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      supabaseId, 
      examId, 
      paperId,
      score, 
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      timeSpent
    } = body

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'Missing supabaseId' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOneAndUpdate(
      { supabaseId },
      {
        $push: {
          examHistory: {
            examId,
            paperId,
            score,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            skippedQuestions,
            timeSpent,
            completedAt: new Date(),
          },
        },
        $set: {
          lastActive: new Date(),
        },
      },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Exam history updated',
    })
  } catch (error: any) {
    console.error('Error updating exam history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update exam history' },
      { status: 500 }
    )
  }
}
