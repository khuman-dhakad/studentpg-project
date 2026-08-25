/**
 * Route access control based on authenticated user role.
 */

export const PROTECTED_ZONES = {
  OWNER: '/owner',
  ADMIN: '/admin',
} as const;

export type UserRole = 'OWNER' | 'ADMIN' | null;

export function evaluateRouteClearance(
  role: UserRole,
  routePath: string,
): boolean {
  /*
   * ADMIN routes
   */

  if (
    routePath === PROTECTED_ZONES.ADMIN ||
    routePath.startsWith(`${PROTECTED_ZONES.ADMIN}/`)
  ) {
    return role === 'ADMIN';
  }

  /*
   * OWNER routes
   */

  if (
    routePath === PROTECTED_ZONES.OWNER ||
    routePath.startsWith(`${PROTECTED_ZONES.OWNER}/`)
  ) {
    /*
     * Public owner entry routes
     */

    if (
      routePath === '/owner/login' ||
      routePath === '/owner/register'
    ) {
      return true;
    }

    return role === 'OWNER';
  }

  /*
   * Public routes
   */

  return true;
}