import { cookies } from 'next/headers';

/**
 * Server-Only JWT Session management layer.
 * Keeps auth credentials securely contained inside non-javascript readable httpOnly cookies.
 */

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'studentpg_session';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 Ghante matching Spring Boot expiration guidelines
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}