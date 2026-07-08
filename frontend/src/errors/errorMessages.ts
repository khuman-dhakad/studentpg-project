/**
 * Consolidated UX user alert strings for resilient error visual blocks.
 */
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Something went wrong. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: "Access denied. You don't have permission to view this page.",
  VALIDATION_FAILED: 'Please check the form and enter valid details.',
  NETWORK_ERROR: 'Unable to connect to the server. Please try again later.',
} as const;