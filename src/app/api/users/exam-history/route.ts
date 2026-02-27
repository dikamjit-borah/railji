import { NextResponse } from 'next/server'

// TODO: Implement exam history persistence (MongoDB removed)
export async function POST() {
  return NextResponse.json({ success: true, message: 'Exam history received' })
}
