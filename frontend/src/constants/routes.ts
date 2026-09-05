/**
 * Immutable Single-Source-of-Truth App Router application navigation matrix.
 */
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  AREAS: '/areas',
  PG_DETAILS: (id: string) => `/pg/${id}`,
  SUPPORT: '/support',
  ABOUT: '/about',
  OWNER: {
    LOGIN: '/owner/login',
    REGISTER: '/owner/register',
    FORGOT_PASSWORD: '/owner/forgot-password',
    DASHBOARD: '/owner/dashboard',
    ADD_PG: '/owner/add-pg',
   
    PROFILE: '/owner/profile',
     EDIT_PG: (id: string) => `/owner/edit-pg/${id}`,
  },
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
  },
} as const;