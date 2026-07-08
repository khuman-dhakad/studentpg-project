/**
 * Edge firewall matrices built to prevent route bypass vulnerabilities.
 */

export const PROTECTED_ZONES = {
  OWNER: '/owner',
  ADMIN: '/admin',
} as const;

export function evaluateRouteClearance(role: 'OWNER' | 'ADMIN' | null, routePath: string): boolean {
  if (routePath.startsWith(PROTECTED_ZONES.ADMIN)) {
    return role === 'ADMIN';
  }

  if (routePath.startsWith(PROTECTED_ZONES.OWNER)) {
    // Escape routes for public registration/login entry points
    if (routePath === '/owner/login' || routePath === '/owner/register') {
      return true;
    }
    return role === 'OWNER';
  }

  return true;
}