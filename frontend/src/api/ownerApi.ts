import { baseApi } from '@/api/baseApi';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';

import type { PG } from '@/types/pg.types';
import type {
  OwnerProfile,
  UpdateProfilePayload,
} from '@/types/owner.types';

/* =========================================================
 * RESPONSE TYPES
 * ========================================================= */

export interface UpdateOwnerProfileResponse {
  message: string;
  profile?: OwnerProfile;
}

export interface UpdateAvatarResponse {
  message: string;
  profileImageUrl?: string;
}

/* =========================================================
 * OWNER API
 * ========================================================= */

export const ownerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================================================
     * GET OWNER PROFILE
     * ===================================================== */

    getOwnerProfile: builder.query<OwnerProfile, void>({
      query: () => ({
        url: BACKEND_ENDPOINTS.OWNERS.PROFILE,
        method: 'GET',
      }),

      providesTags: [
        {
          type: 'OwnerProfile',
          id: 'CURRENT',
        },
      ],
    }),

    /* =====================================================
     * UPDATE OWNER PROFILE
     * ===================================================== */

    updateOwnerProfile: builder.mutation<
      UpdateOwnerProfileResponse,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: BACKEND_ENDPOINTS.OWNERS.PROFILE,
        method: 'PUT',
        body,
      }),

      invalidatesTags: [
        {
          type: 'OwnerProfile',
          id: 'CURRENT',
        },
        'Session',
      ],
    }),

    /* =====================================================
     * UPDATE PROFILE IMAGE
     * ===================================================== */

    updateAvatar: builder.mutation<
      UpdateAvatarResponse,
      {
        publicId: string;
        url: string;
      }
    >({
      query: (body) => ({
        url: BACKEND_ENDPOINTS.OWNERS.PROFILE_IMAGE,
        method: 'POST',
        body,
      }),

      invalidatesTags: [
        {
          type: 'OwnerProfile',
          id: 'CURRENT',
        },
        'Session',
      ],
    }),

    /* =====================================================
     * GET OWNER LISTINGS
     * ===================================================== */

    getOwnerListings: builder.query<PG[], void>({
      query: () => ({
        url: BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS,
        method: 'GET',
      }),

      providesTags: (result) => [
        'OwnerListings',

        ...(result ?? []).map((pg) => ({
          type: 'OwnerListings' as const,
          id: pg.id,
        })),
      ],
    }),

    /* =====================================================
     * CREATE LISTING
     * ===================================================== */

    createListing: builder.mutation<
      PG,
      Partial<PG>
    >({
      query: (body) => ({
        url: BACKEND_ENDPOINTS.PGS.OWNER_LISTINGS,
        method: 'POST',
        body,
      }),

      invalidatesTags: [
        'OwnerListings',
        'PublicPgs',
      ],
    }),

    /* =====================================================
     * UPDATE LISTING
     * ===================================================== */

    updateListing: builder.mutation<
      PG,
      {
        id: string;
        body: Partial<PG>;
      }
    >({
      query: ({ id, body }) => ({
        url: BACKEND_ENDPOINTS.PGS.BY_ID(id),
        method: 'PUT',
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        'OwnerListings',

        {
          type: 'OwnerListings',
          id,
        },

        'PublicPgs',
      ],
    }),

    /* =====================================================
     * DELETE LISTING
     * ===================================================== */

    deleteListing: builder.mutation<
      {
        message: string;
      },
      string
    >({
      query: (id) => ({
        url: BACKEND_ENDPOINTS.PGS.BY_ID(id),
        method: 'DELETE',
      }),

      invalidatesTags: (_result, _error, id) => [
        'OwnerListings',

        {
          type: 'OwnerListings',
          id,
        },

        'PublicPgs',
      ],
    }),
  }),
});

/* =========================================================
 * GENERATED HOOKS
 * ========================================================= */

export const {
  useGetOwnerProfileQuery,
  useUpdateOwnerProfileMutation,
  useUpdateAvatarMutation,
  useGetOwnerListingsQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
} = ownerApi;