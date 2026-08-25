import { baseApi } from '@/api/baseApi';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

/* =========================================================
 * TYPES
 * ========================================================= */

export type UserRole = 'OWNER' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  type: 'Bearer';
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
}

export interface SessionResponse {
  isAuthenticated: boolean;
  user: SessionUser | null;
  profile: SessionProfile | null;
}

/* =========================================================
 * AUTH API
 * ========================================================= */

export const authApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    /* =====================================================
     * LOGIN
     * POST /api/auth/login
     * ===================================================== */

    login: builder.mutation<
      LoginResponse,
      LoginRequest
    >({

      query: (credentials) => ({

        url: BACKEND_ENDPOINTS.AUTH.LOGIN,

        method: 'POST',

        body: credentials,

      }),

      invalidatesTags: [

        'Session',

        'OwnerProfile',

        'OwnerListings',

        'AdminStats',

        'AdminPending',

      ],

    }),


    /* =====================================================
     * OWNER REGISTER
     * POST /api/owners/register
     * ===================================================== */

    ownerRegister: builder.mutation<

      MessageResponse,

      Record<string, unknown>

    >({

      query: (userData) => ({

        url: BACKEND_ENDPOINTS.OWNERS.REGISTER,

        method: 'POST',

        body: userData,

      }),

    }),


    /* =====================================================
     * GET CURRENT SESSION
     * GET /api/auth/session
     * ===================================================== */

    session: builder.query<

      SessionResponse,

      void

    >({

      query: () => ({

        url: BACKEND_ENDPOINTS.AUTH.SESSION,

        method: 'GET',

      }),

      providesTags: [

        'Session',

      ],

    }),


    /* =====================================================
     * LOGOUT
     * POST /api/auth/logout
     * ===================================================== */

    logout: builder.mutation<

      LogoutResponse,

      void

    >({

      query: () => ({

        url: BACKEND_ENDPOINTS.AUTH.LOGOUT,

        method: 'POST',

      }),

      invalidatesTags: [

        'Session',

        'OwnerProfile',

        'OwnerListings',

        'AdminStats',

        'AdminPending',

        'Notifications',

      ],

    }),

  }),

});


/* =========================================================
 * GENERATED RTK QUERY HOOKS
 * ========================================================= */

export const {

  useLoginMutation,

  useOwnerRegisterMutation,

  useSessionQuery,

  useLogoutMutation,

} = authApi;