/**
 * Server-Only JWT Session management layer.
 * Keeps auth credentials securely contained inside non-javascript readable httpOnly cookies.
 */

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'access_token';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function isServerEnvironment() {
  return typeof window === 'undefined';
}

export async function setAuthCookie(token: string) {
  if (!isServerEnvironment()) {
    return;
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'none' : 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  if (!isServerEnvironment()) {
    return undefined;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
  } catch {
    return undefined;
  }
}

export async function clearAuthCookie() {
  if (!isServerEnvironment()) {
    return;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {
    // Ignore cookie access failures during prerender/static export scenarios.
  }
}