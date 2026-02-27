// TEMPORARY: Reads users from a local JSON file instead of MongoDB
import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'tmp-users.json')

async function readUsers(): Promise<any[]> {
  try {
    const raw = await readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeUsers(users: any[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(users, null, 2), 'utf-8')
}

// GET /api/users/[supabaseId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ supabaseId: string }> }
) {
  try {
    const { supabaseId } = await params

    if (!supabaseId) {
      return NextResponse.json(
        { error: 'Missing supabaseId' },
        { status: 400 }
      )
    }

    const users = await readUsers()
    const user = users.find((u) => u.supabaseId === supabaseId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update lastActive in file
    user.lastActive = new Date().toISOString()
    await writeUsers(users)

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

