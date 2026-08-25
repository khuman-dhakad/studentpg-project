import { ApiError } from '@/errors/ApiError';
import { ERROR_MESSAGES } from '@/errors/errorMessages';
import { BACKEND_API_URL } from '@/constants/config';


/* =========================================================
 * CONFIGURATION
 * ========================================================= */

const BACKEND_URL = BACKEND_API_URL;
const NORMALIZED_BACKEND_URL = BACKEND_URL.replace(/\/+$/, '');

let lastSetCookieHeader: string | null = null;

function captureSetCookieHeader(response: Response) {
  const setCookieHeader =
    typeof response.headers?.getSetCookie === 'function'
      ? response.headers.getSetCookie().join(', ')
      : response.headers.get('set-cookie');

  lastSetCookieHeader = setCookieHeader ?? null;
  return lastSetCookieHeader;
}

export function getLastSetCookieHeader(): string | null {
  return lastSetCookieHeader;
}

export function clearLastSetCookieHeader() {
  lastSetCookieHeader = null;
}

/* =========================================================
 * TYPES
 * ========================================================= */

interface RequestOptions extends RequestInit {
  token?: string;
  isMultipart?: boolean;
}


type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

/* =========================================================
 * SERVER-SIDE TOKEN RESOLUTION
 * ========================================================= */

async function resolveAuthToken(
  explicitToken?: string,
): Promise<string | undefined> {

  /*
   * Explicit token always has priority.
   */

  if (explicitToken) {
    return explicitToken;
  }


  /*
   * Never attempt to read HttpOnly cookies in the browser.
   */

  if (typeof window !== 'undefined') {
    return undefined;
  }


  try {

    const {
      getAuthToken,
    } = await import('@/auth/cookies');


    return await getAuthToken();

  } catch (error) {

    console.warn(
      'Unable to resolve authentication cookie on server.',
      error,
    );

    return undefined;
  }
}


/* =========================================================
 * RESPONSE PARSER
 * ========================================================= */

async function parseResponse<T>(
  response: Response,
): Promise<T> {

  /*
   * 204 No Content
   */

  if (response.status === 204) {
    return undefined as T;
  }


  const contentType =
    response.headers.get('content-type') || '';


  /*
   * Plain-text response
   */

  if (
    !contentType
      .toLowerCase()
      .includes('application/json')
  ) {

    const textPayload =
      await response.text();


    if (!response.ok) {

      throw new ApiError(
        textPayload ||
        ERROR_MESSAGES.GENERIC_ERROR,

        response.status,
      );
    }


    return textPayload as unknown as T;
  }


  /*
   * JSON response
   */

let jsonPayload: unknown;

try {
  jsonPayload = await response.json();
} catch {
  throw new ApiError(
    ERROR_MESSAGES.GENERIC_ERROR,
    response.status,
  );
}

if (!response.ok) {
  const errorPayload = jsonPayload as ApiErrorPayload;

  throw new ApiError(
    errorPayload.message ||
    errorPayload.error ||
    ERROR_MESSAGES.GENERIC_ERROR,

    response.status,

    errorPayload.errors,
  );
}

return jsonPayload as T;
}

/* =========================================================
 * BACKEND CLIENT
 * ========================================================= */

export const backendClient = {


  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {


    const activeToken =
      await resolveAuthToken(
        options.token,
      );


    const normalizedEndpoint =
      endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;


    const url =
      `${NORMALIZED_BACKEND_URL}${normalizedEndpoint}`;


    const headers =
      new Headers(options.headers);


    /*
     * Authentication
     */

    if (activeToken) {

      headers.set(
        'Authorization',
        `Bearer ${activeToken}`,
      );
    }


    /*
     * JSON content type.
     *
     * Never manually set Content-Type for FormData.
     */

    if (
      !options.isMultipart &&
      !headers.has('Content-Type') &&
      options.body !== undefined
    ) {

      headers.set(
        'Content-Type',
        'application/json',
      );
    }


    /*
     * Accept JSON by default.
     */

    if (!headers.has('Accept')) {

      headers.set(
        'Accept',
        'application/json',
      );
    }


    try {

      const response =
       await fetch(url,{
    ...options,
    headers,

    cache:"no-store",
    credentials: "include",
})

      captureSetCookieHeader(response);

      /*
       * Authentication failures
       */

      if (response.status === 401) {

        throw new ApiError(
          ERROR_MESSAGES.UNAUTHORIZED,
          401,
        );
      }


      if (response.status === 403) {

        throw new ApiError(
          ERROR_MESSAGES.FORBIDDEN,
          403,
        );
      }


      return await parseResponse<T>(
        response,
      );


    } catch (error) {


      /*
       * Preserve application errors.
       */

      if (
        error instanceof ApiError
      ) {

        throw error;
      }


      /*
       * Network / transport error.
       */

      console.error(
        'Backend request failed:',
        error,
      );


      throw new ApiError(
        ERROR_MESSAGES.NETWORK_ERROR,
        500,
      );
    }
  },


  async get<T>(
    endpoint: string,
    options?: Omit<
      RequestOptions,
      'method' | 'body'
    >,
  ): Promise<T> {

    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'GET',
      },
    );
  },


  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<
      RequestOptions,
      'method' | 'body'
    >,
  ): Promise<T> {


    const isMultipart =
      typeof FormData !== 'undefined' &&
      body instanceof FormData;


    return this.request<T>(
      endpoint,
      {
        ...options,

        method: 'POST',

        isMultipart,

        body:
          body === undefined
            ? undefined
            : isMultipart
              ? body
              : JSON.stringify(body),
      },
    );
  },


  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<
      RequestOptions,
      'method' | 'body'
    >,
  ): Promise<T> {


    const isMultipart =
      typeof FormData !== 'undefined' &&
      body instanceof FormData;


    return this.request<T>(
      endpoint,
      {
        ...options,

        method: 'PUT',

        isMultipart,

        body:
          body === undefined
            ? undefined
            : isMultipart
              ? body
              : JSON.stringify(body),
      },
    );
  },


  async delete<T>(
    endpoint: string,
    options?: Omit<
      RequestOptions,
      'method'
    >,
  ): Promise<T> {

    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'DELETE',
      },
    );
  },
};