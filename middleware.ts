// ⚠️ This file is intentionally empty.
// Middleware has been moved to src/middleware.ts
// Next.js requires middleware inside src/ when using the src directory structure.
// See: https://nextjs.org/docs/app/building-your-application/routing/middleware


export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/auth')
  const isApiRoute = pathname.startsWith('/api')
  const isHomePage = pathname === '/'
  const isProtectedRoute = !isHomePage && !isAuthPage && !isApiRoute

  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      // AuthSessionMissingError is normal for unauthenticated requests — not a real error
      if (error.name !== 'AuthSessionMissingError') {
        console.error('[middleware] supabase.auth.getUser error:', error.message)
      }
    } else {
      user = data.user
    }
  } catch (err) {
    console.error('[middleware] unexpected error calling getUser:', err)
    // treat as unauthenticated on error
  }

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthPage && user && !pathname.includes('/callback')) {
    return NextResponse.redirect(new URL('/departments', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|json|lottie)$).*)',
  ],
}
