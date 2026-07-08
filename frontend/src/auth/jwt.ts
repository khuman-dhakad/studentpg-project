export interface DecodedJWTPayload {
  sub: string; // User email addresses
  exp: number; // Unix Epoch lifecycle boundaries
}

/**
 * Inspects token string bytes defensively without execution side-effects.
 */
export function decodeAndVerifyTokenLifecycle(token: string): { email: string | null; isExpired: boolean } {
  try {
    const componentChunks = token.split('.');
    if (componentChunks.length !== 3 || !componentChunks[1]) {
      return { email: null, isExpired: true };
    }

    // Node buffer translation process
    const verifiedJson = Buffer.from(componentChunks[1], 'base64').toString('utf-8');
    const parsedPayload = JSON.parse(verifiedJson) as DecodedJWTPayload;

    if (!parsedPayload.sub || !parsedPayload.exp) {
      return { email: null, isExpired: true };
    }

    const currentUnixEpoch = Math.floor(Date.now() / 1000);
    const tokenIsExpired = parsedPayload.exp < currentUnixEpoch;

    return { email: parsedPayload.sub, isExpired: tokenIsExpired };
  } catch {
    return { email: null, isExpired: true };
  }
}