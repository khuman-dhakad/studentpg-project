import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookieStoreMock = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStoreMock),
}));

describe('auth cookie helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookieStoreMock.get.mockReturnValue(undefined);
    cookieStoreMock.set.mockReturnValue(undefined);
    cookieStoreMock.delete.mockReturnValue(undefined);
  });

  it('reads the backend access token from the access_token cookie', async () => {
    cookieStoreMock.get.mockReturnValue({ value: 'backend-token' });

    const { getAuthToken } = await import('../../src/auth/cookies');
    await expect(getAuthToken()).resolves.toBe('backend-token');
    expect(cookieStoreMock.get).toHaveBeenCalledWith('access_token');
  });

  it('writes the backend access token cookie when setting auth state', async () => {
    const { setAuthCookie } = await import('../../src/auth/cookies');

    await setAuthCookie('backend-token');

    expect(cookieStoreMock.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'access_token',
        value: 'backend-token',
      })
    );
  });
});
