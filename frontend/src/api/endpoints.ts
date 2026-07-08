/**
 * Hardcoded absolute backend endpoints matching the Spring Boot service specifications.
 * These are called exclusively by the server-side backendClient proxy layer.
 */
export const BACKEND_ENDPOINTS = {
  OWNERS: {
    REGISTER: '/owners/register',
    LOGIN: '/owners/login',
    PROFILE: '/owners/profile',
    CHANGE_PASSWORD: '/owners/change-password',
    FORGOT_PASSWORD: '/owners/forgot-password',
    RESET_PASSWORD: '/owners/reset-password',
    PROFILE_IMAGE: '/owners/profile-image',
  },
  ADMIN: {
    LOGIN: '/admin/auth/login',
    PENDING_PGS: '/admin/pgs/pending',
    STATS: '/admin/pgs/stats',
    PGS: '/admin/pgs',
    APPROVE_PG: (id: string) => `/admin/pgs/${id}/approve`,
    REJECT_PG: (id: string) => `/admin/pgs/${id}`,
    SUGGESTIONS: '/admin/pgs/suggestions',
  },
  PGS: {
    BASE: '/pgs',
    BY_ID: (id: string) => `/pgs/${id}`,
    OWNER_LISTINGS: '/pgs/owner',
    IMAGES: (pgId: string) => `/pgs/${pgId}/images`,
  },
  STUDENT: {
    PGS: '/student/pgs',
    BY_ID: (id: string) => `/student/pgs/${id}`,
    SEARCH_CITY: '/student/pgs/search',
    SEARCH_GENDER: '/student/pgs/search/gender',
    SEARCH_RENT: '/student/pgs/search/rent',
    FILTER: '/student/pgs/filter',
  },
  SEARCH: {
    TEXT: '/search',
  },
} as const;