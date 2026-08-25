/**
 * Centralized backend endpoint contract.
 *
 * These endpoints MUST match Spring Boot controller mappings.
 */

export const BACKEND_ENDPOINTS = {
  /* =========================================================
   * AUTHENTICATION
   * ========================================================= */

  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    SESSION: "/api/auth/session",
  },

  /* =========================================================
   * OWNER
   * ========================================================= */

  OWNERS: {
    REGISTER: "/api/owners/register",

    PROFILE: "/api/owners/profile",

    CHANGE_PASSWORD: "/api/owners/change-password",

    FORGOT_PASSWORD: "/api/owners/forgot-password",

    RESET_PASSWORD: "/api/owners/reset-password",

    PROFILE_IMAGE: "/api/owners/profile-image",
  },

  /* =========================================================
   * OWNER PG MANAGEMENT
   * ========================================================= */

  PGS: {
    OWNER_LISTINGS: "/api/owner/pgs",

    UPLOAD_IMAGE: "/api/owner/pgs/images/upload",

    BY_ID: (id: string) =>
      `/api/owner/pgs/${encodeURIComponent(id)}`,

    IMAGES: (id: string) =>
      `/api/owner/pgs/${encodeURIComponent(id)}/images`,
  },

  /* =========================================================
   * STUDENT
   * ========================================================= */

  STUDENT: {
    PGS: "/api/student/pgs",

    BY_ID: (id: string) =>
      `/api/student/pgs/${encodeURIComponent(id)}`,

    SEARCH_CITY: "/api/student/pgs/search",

    SEARCH_GENDER: "/api/student/pgs/search/gender",

    SEARCH_RENT: "/api/student/pgs/search/rent",

    FILTER: "/api/student/pgs/filter",

    SEARCH_SUGGESTIONS:
      "/api/student/pgs/search-suggestions",
  },

  /* =========================================================
   * ADMIN
   * ========================================================= */

  ADMIN: {
    PENDING_PGS: "/api/admin/pgs/pending",

    STATS: "/api/admin/pgs/stats",

    PGS: "/api/admin/pgs",

    APPROVE_PG: (id: string) =>
      `/api/admin/pgs/${encodeURIComponent(id)}/approve`,

    REJECT_PG: (id: string) =>
      `/api/admin/pgs/${encodeURIComponent(id)}/reject`,

    SUGGESTIONS: "/api/admin/pgs/suggestions",

    BY_ID: (id: string) =>
      `/api/admin/pgs/${encodeURIComponent(id)}`,
  },

  /* =========================================================
   * NOTIFICATIONS
   * ========================================================= */

  NOTIFICATIONS: {
    ALL: "/api/notifications",

    UNREAD_COUNT: "/api/notifications/unread-count",

    MARK_READ: (id: string) =>
      `/api/notifications/${encodeURIComponent(id)}/read`,

    DELETE: (id: string) =>
      `/api/notifications/${encodeURIComponent(id)}`,
  },

  /* =========================================================
   * GLOBAL SEARCH
   * ========================================================= */

  SEARCH: {
    TEXT: "/api/search",
  },

  /* =========================================================
   * FRONTEND APP ROUTES
   * ========================================================= */

  APP_API: {
    CONTACT: "/api/contact",
    CAPTCHA: "/api/public/captcha",
    REPORT_ISSUE: "/api/report-issue",
  },
} as const;