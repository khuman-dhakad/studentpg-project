/**
 * Global standardized API communications types matching Spring Boot backend specifications.
 */

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ValidationErrorResponse {
  status: number;
  message: string;
  errors: Record<string, string>;
}

export interface BaseLoginResponse {
  message: string;
  token: string | null;
  type: string | null;
  email: string | null;
  role: 'OWNER' | 'ADMIN' | null;
}