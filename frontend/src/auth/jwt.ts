import { jwtVerify, type JWTPayload } from 'jose';

export interface DecodedJWTPayload extends JWTPayload {
  sub: string;
}

/**
 * Returns the JWT verification secret.
 *
 * This secret must be the same secret used by the backend
 * to sign the JWT.
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET is not configured in the frontend environment.'
    );
  }

  return new TextEncoder().encode(secret);
}

/**
 * Cryptographically verifies the JWT signature and validates
 * the token lifecycle.
 *
 * Important:
 * This function does NOT merely decode the payload.
 * It verifies that the token was actually signed by the trusted backend.
 */
export async function decodeAndVerifyTokenLifecycle(
  token: string
): Promise<{
  email: string | null;
  isExpired: boolean;
}> {
  try {
    if (!token || typeof token !== 'string') {
      return {
        email: null,
        isExpired: true,
      };
    }

    const { payload } = await jwtVerify(
      token,
      getJwtSecret(),
      {
        algorithms: ['HS256'],
      }
    );

    const email =
      typeof payload.sub === 'string'
        ? payload.sub.trim().toLowerCase()
        : null;

    const exp =
      typeof payload.exp === 'number'
        ? payload.exp
        : null;

    if (!email || exp === null) {
      return {
        email: null,
        isExpired: true,
      };
    }

    const currentUnixEpoch = Math.floor(
      Date.now() / 1000
    );

    return {
      email,
      isExpired: exp <= currentUnixEpoch,
    };
  } catch {
    return {
      email: null,
      isExpired: true,
    };
  }
}