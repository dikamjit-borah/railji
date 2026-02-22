import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(
  request: Request,
  { params }: { params: { supabaseId: string } }
) {
  try {
    const { supabaseId } = params

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'Missing supabaseId' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ supabaseId })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update last active
    user.lastActive = new Date()
    await user.save()

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        supabaseId: user.supabaseId,
        email: user.email,
        name: user.name,
        department: user.department,
        examHistory: user.examHistory,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      },
    })
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
