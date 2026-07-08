/**
 * Hardcoded framework role constraints matching target microservice definitions.
 */
export const ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];