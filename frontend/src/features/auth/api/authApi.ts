import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import {
  baseApi,
} from '@/api/baseApi';

const APP_AUTH_ROUTES = {
  LOGIN: BACKEND_ENDPOINTS.AUTH.LOGIN,
  SESSION: BACKEND_ENDPOINTS.AUTH.SESSION,
  LOGOUT: BACKEND_ENDPOINTS.AUTH.LOGOUT,
} as const;

import { CACHE_TAGS } from '@/api/tagTypes';

/* =========================================================
 * TYPES
 * ========================================================= */

export type UserRole =
  | 'OWNER'
  | 'ADMIN';


export interface LoginRequest {

  email: string;

  password: string;

}


/*
 * Production cookie-based authentication में
 * frontend को token consume करने की जरूरत नहीं है।
 *
 * Backend ideally response देगा:
 *
 * {
 *   "message": "Login successful",
 *   "role": "OWNER",
 *   "email": "owner@example.com"
 * }
 *
 * JWT HttpOnly Cookie में रहेगा।
 */

export interface LoginResponse {

  message: string;

  role: UserRole;

  email: string;

}


export interface LogoutResponse {

  message: string;

}


export interface MessageResponse {

  success: boolean;

  message: string;

}


export interface SessionUser {

  email: string;

  role: UserRole;

}


export interface SessionProfile {

  id?: string;

  name?: string;

  email?: string;

  phone?: string;

  profileImageUrl?: string;
  verificationStatus?: 'NOT_VERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationRejectionReason?: string | null;

}


export interface SessionResponse {

  isAuthenticated: boolean;

  user: SessionUser | null;

  profile: SessionProfile | null;

}


/* =========================================================
 * AUTH API
 * ========================================================= */

export const authApi =
  baseApi.injectEndpoints({

    endpoints:
      (builder) => ({

        /* ================================================
         * LOGIN
         * POST /api/auth/login
         * ================================================ */

        login:

          builder.mutation<

            LoginResponse,

            LoginRequest

          >({

            query:
              (credentials) => ({

                url: APP_AUTH_ROUTES.LOGIN,

                method:
                  'POST',

                body:
                  credentials,

              }),

            invalidatesTags: [

              CACHE_TAGS.SESSION,

              CACHE_TAGS.OWNER_PROFILE,

              CACHE_TAGS.OWNER_LISTINGS,

              CACHE_TAGS.ADMIN_STATS,

              CACHE_TAGS.ADMIN_PENDING,

            ],

          }),


        /* ================================================
         * OWNER REGISTER
         * POST /api/owners/register
         * ================================================ */

        ownerRegister:

          builder.mutation<

            MessageResponse,

            Record<string, unknown>

          >({

            query:
              (userData) => ({

                url: BACKEND_ENDPOINTS.OWNERS.REGISTER, 

                method:
                  'POST',

                body:
                  userData,

              }),

          }),


        /* ================================================
         * CURRENT SESSION
         * GET /api/auth/session
         * ================================================ */

        session:

          builder.query<

            SessionResponse,

            void

          >({

            query:
              () => ({

                url: APP_AUTH_ROUTES.SESSION,

                method:
                  'GET',

              }),

            providesTags: [

                CACHE_TAGS.SESSION,

              ],

          }),


        /* ================================================
         * LOGOUT
         * POST /api/auth/logout
         * ================================================ */

        logout:

          builder.mutation<

            LogoutResponse,

            void

          >({

            query:
              () => ({

                url: APP_AUTH_ROUTES.LOGOUT,

                method:
                  'POST',

              }),

          invalidatesTags: [
            CACHE_TAGS.SESSION,
            CACHE_TAGS.OWNER_PROFILE,
            CACHE_TAGS.OWNER_LISTINGS,
            CACHE_TAGS.ADMIN_STATS,
            CACHE_TAGS.ADMIN_PENDING,
            CACHE_TAGS.NOTIFICATIONS,
          ],

          }),

      }),

  });


export const {

  useLoginMutation,

  useOwnerRegisterMutation,

  useSessionQuery,

  useLogoutMutation,

} = authApi;