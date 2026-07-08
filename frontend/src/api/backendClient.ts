import { getAuthToken } from '@/auth/cookies';
import { ApiError } from '@/errors/ApiError';
import { ERROR_MESSAGES } from '@/errors/errorMessages';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  token?: string;
  isMultipart?: boolean;
}

/**
 * Server-only fetch wrapper. Intercepts backend anomalies (such as string payloads inside 200 statuses)
 * and safely transforms or passes structured exceptions back up to Next.js route handlers.
 */
export const backendClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;
    
    let activeToken = options.token;
    if (!activeToken) {
      activeToken = await getAuthToken();
    }

    const headers = new Headers(options.headers);
    if (activeToken) {
      headers.set('Authorization', `Bearer ${activeToken}`);
    }

    if (!options.isMultipart && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        throw new ApiError(ERROR_MESSAGES.UNAUTHORIZED, 401);
      }
      if (response.status === 403) {
        throw new ApiError(ERROR_MESSAGES.FORBIDDEN, 403);
      }

      const contentType = response.headers.get('content-type') || '';
      
      // Explicitly capture backend @Valid DTO structural validation matrices
      if (response.status === 400 && contentType.includes('application/json')) {
        const errorJson = await response.json();
        throw new ApiError(errorJson.message || 'Validation Failed', 400, errorJson.errors);
      }

      // Read plaintext responses cleanly if the content type is not JSON
      if (!contentType.includes('application/json')) {
        const textPayload = await response.text();
        if (!response.ok) {
          throw new ApiError(textPayload || ERROR_MESSAGES.GENERIC_ERROR, response.status);
        }
        return textPayload as unknown as T;
      }

      const jsonPayload = await response.json();
      
      if (!response.ok) {
        throw new ApiError(jsonPayload.message || ERROR_MESSAGES.GENERIC_ERROR, response.status);
      }

      return jsonPayload as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 500);
    }
  },

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    const isMultipart = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      isMultipart,
      body: isMultipart ? body : JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    const isMultipart = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      isMultipart,
      body: isMultipart ? body : JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};