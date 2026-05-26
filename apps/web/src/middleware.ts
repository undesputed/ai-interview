import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protect authenticated routes. We only check for the *presence* of the
 * access cookie here — full verification happens server-side via /auth/me.
 * That's enough to bounce unauthenticated traffic before it ever renders.
 *
 * Matched routes are configured in `config.matcher` below.
 */
export function middleware(req: NextRequest) {
  const hasAccess = req.cookies.has('mv_access') || req.cookies.has('mv_refresh');
  if (hasAccess) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/interviews/:path*',
    '/meetings/:path*',
    '/rooms/:path*',
    '/settings/:path*',
  ],
};
