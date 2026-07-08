/**
 * Business and technical system boundary definitions.
 */
export const CONFIG = {
  MAX_IMAGE_COUNT: 3,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // Strict 5MB file verification limits
  GENDERS: ['Boys', 'Girls', 'Unisex'] as const,
  PAGINATION_DEFAULT_SIZE: 10,
  PAGINATION_MAX_SIZE: 50, // Hard cap enforced server-side by backend
} as const;