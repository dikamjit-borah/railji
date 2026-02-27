// TEMPORARY: Stores users in a local JSON file instead of MongoDB
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

// POST /api/users/create
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supabaseId, email, name } = body

    if (!supabaseId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: supabaseId, email, name' },
        { status: 400 }
      )
    }

    const users = await readUsers()

    // Return existing user (idempotent)
    const existing = users.find((u) => u.supabaseId === supabaseId)
    if (existing) {
      return NextResponse.json(
        { success: true, userId: existing.id, message: 'User already exists' },
        { status: 200 }
      )
    }

    const newUser = {
      id: `local_${Date.now()}`,
      supabaseId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      examHistory: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }

    users.push(newUser)
    await writeUsers(users)

    return NextResponse.json(
      { success: true, userId: newUser.id, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
