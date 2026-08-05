import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Protect all routes except auth and static assets
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    // Allow public files and authentication routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/auth')
    ) {
      return NextResponse.next()
    }

    // Attach tenant id to request headers for server-side scoping
    const token = (req as any).nextauth?.token as any
    const res = NextResponse.next()
    if (token && token.user && token.user.tenantId) {
      res.headers.set('x-tenant-id', token.user.tenantId)
    }
    return res
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Require an authenticated session for non-public routes
        return !!token
      }
    }
  }
)

export const config = { matcher: '/((?!api/auth|auth|_next|static).*)' }
