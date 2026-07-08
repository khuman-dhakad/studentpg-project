/**
 * Immutable Single-Source-of-Truth App Router application navigation matrix.
 */
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  PG_DETAILS: (id: string) => `/pg/${id}`,
  SUPPORT: '/support',
  OWNER: {
    LOGIN: '/owner/login',
    REGISTER: '/owner/register',
    FORGOT_PASSWORD: '/owner/forgot-password',
    DASHBOARD: '/owner/dashboard',
    ADD_PG: '/owner/add-pg',
    EDIT_PG: (id: string) => `/owner/edit-pg/${id}`,
    PROFILE: '/owner/profile',
  },
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
  },
} as const;