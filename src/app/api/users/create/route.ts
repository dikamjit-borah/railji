import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supabaseId, email, name, department } = body

    if (!supabaseId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ supabaseId })
    if (existingUser) {
      return NextResponse.json(
        { success: true, userId: existingUser._id, message: 'User already exists' },
        { status: 200 }
      )
    }

    // Create new user in MongoDB
    const user = await User.create({
      supabaseId,
      email,
      name,
      ...(department && { department }),
      examHistory: [],
      lastActive: new Date(),
    })

    return NextResponse.json({
      success: true,
      userId: user._id,
      message: 'User created successfully',
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
