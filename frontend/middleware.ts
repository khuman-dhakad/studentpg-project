import { NextRequest, NextResponse } from 'next/server';
import { decodeAndVerifyTokenLifecycle } from '@/auth/jwt';

const PROTECTED_PREFIXES = ['/owner', '/admin'];

const LOGIN_ROUTES = {
  owner: '/owner/login',
  admin: '/admin/login',
} as const;

const SESSION_COOKIE_NAME = 'access_token';

function getLoginRoute(pathname: string) {
  return pathname.startsWith('/admin')
    ? LOGIN_ROUTES.admin
    : LOGIN_ROUTES.owner;
}

export async  function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(
    SESSION_COOKIE_NAME
  );

  const loginRoute = getLoginRoute(pathname);

  if (!sessionCookie?.value) {
    return NextResponse.redirect(
      new URL(loginRoute, request.url)
    );
  }

  try {
   const {
  email,
  isExpired,
} = await decodeAndVerifyTokenLifecycle(
  sessionCookie.value
);

    if (!email || isExpired) {
      const response = NextResponse.redirect(
        new URL(loginRoute, request.url)
      );

      response.cookies.delete(
        SESSION_COOKIE_NAME
      );

      return response;
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL(loginRoute, request.url)
    );

    response.cookies.delete(
      SESSION_COOKIE_NAME
    );

    return response;
  }
}

export const config = {
  matcher: [
    '/owner/:path*',
    '/admin/:path*',
  ],
};