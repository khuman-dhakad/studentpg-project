import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/api/backendClient', () => ({
  backendClient: {
    post: vi.fn(),
    postWithSetCookie: vi.fn(),
  },
}));

vi.mock('@/auth/cookies', () => ({
  setAuthCookie: vi.fn(),
}));

import { backendClient } from '@/api/backendClient';
import { POST as adminLogin } from '../../src/app/api/auth/admin/login/route';
import { POST as ownerForgotPassword } from '../../src/app/api/auth/owner/forgot-password/route';
import { POST as ownerLogin } from '../../src/app/api/auth/owner/login/route';

function requestWithBody(path: string, body: string) {
  return new NextRequest(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

describe('Authentication request validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(['{invalid json', 'null', '[]'])(
    'rejects invalid owner login JSON bodies without calling the backend: %s',
    async (body) => {
      const response = await ownerLogin(requestWithBody('/api/auth/owner/login', body));

      expect(response.status).toBe(400);
      expect(backendClient.postWithSetCookie).not.toHaveBeenCalled();
    }
  );

  it.each(['{invalid json', 'null', '[]'])(
    'rejects invalid admin login JSON bodies without calling the backend: %s',
    async (body) => {
      const response = await adminLogin(requestWithBody('/api/auth/admin/login', body));

      expect(response.status).toBe(400);
      expect(backendClient.postWithSetCookie).not.toHaveBeenCalled();
    }
  );

  it.each([
    '{invalid json',
    'null',
    '[]',
    JSON.stringify({ email: 123 }),
    JSON.stringify({ email: null }),
  ])('rejects invalid forgot-password request bodies without calling the backend: %s', async (body) => {
    const response = await ownerForgotPassword(requestWithBody('/api/auth/owner/forgot-password', body));

    expect(response.status).toBe(400);
    expect(backendClient.post).not.toHaveBeenCalled();
  });
});
