import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/auth/cookies';

/**
 * Fully evicts and clears the security cookie container context on the host workspace.
 */
export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ message: 'Session successfully invalidated' });
}