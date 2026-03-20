import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/login', '/login/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Allow public routes through without any checks
  if (isPublicRoute(req)) {
    // If already logged in, redirect away from login
    if (userId) {
      const role = (sessionClaims?.metadata as { role?: string })?.role
      if (role === 'superadmin') return NextResponse.redirect(new URL('/superadmin', req.url))
      if (role === 'government') return NextResponse.redirect(new URL('/government', req.url))
      if (role === 'company') return NextResponse.redirect(new URL('/company', req.url))
      return NextResponse.redirect(new URL('/', req.url))
    }
    return // let them see the login page
  }

  // Protect all other routes
  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
