import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/departments'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/signin?error=callback_error', requestUrl.origin))
    }

    // For OAuth sign-ups, create MongoDB user profile if it doesn't exist
    if (data.user) {
      try {
        await fetch(`${requestUrl.origin}/api/users/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabaseId: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
            department: data.user.user_metadata?.department || 'Civil',
          }),
        })
      } catch (error) {
        console.error('Error creating user profile:', error)
        // Don't fail the callback if MongoDB sync fails
      }
    }
  }

  return NextResponse.redirect(new URL(redirect, requestUrl.origin))
}
