import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function getSupabaseAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  console.log('Supabase session data:', data)

  if (error) {
    return null
  }

  return data.session?.access_token ?? null
}
