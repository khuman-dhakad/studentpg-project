/**
 * Custom Error model class designed to cleanly unpack validation failure maps
 * and proxy anomalous HTTP Status behaviors upstream to UI view contexts.
 */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}