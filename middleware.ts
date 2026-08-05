import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Protect all routes except auth and static assets
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    // Allow public files and auth routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/auth')
    ) {
      return NextResponse.next()
    }

    // Attach tenant id to request headers for server-side scoping
    const token = (req as any).nextauth?.token as any
    const requestHeaders = new Headers(req.headers)
    if (token?.tenantId) {
      requestHeaders.set('x-tenant-id', token.tenantId)
    }
    return NextResponse.next({ request: { headers: requestHeaders } })
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
