import { createClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'
import Link from 'next/link'

export default async function AuthButton() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return <UserMenu user={user} />
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/auth/signin"
        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        Sign Up
      </Link>
    </div>
  )
}
