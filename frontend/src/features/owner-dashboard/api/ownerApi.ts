import { baseApi } from '@/api/baseApi';
import { PG } from '@/types/pg.types';
import { UpdateProfilePayload } from '@/types/owner.types';

export const ownerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerListings: builder.query<PG[], void>({
      query: () => '/owner/pgs',
      providesTags: ['OwnerListings'],
    }),
    createListing: builder.mutation<PG, Partial<PG>>({
      query: (payload) => ({
        url: '/owner/pgs',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['OwnerListings', 'PublicPgs'],
    }),
    updateListing: builder.mutation<PG, { id: string; body: Partial<PG> }>({
      query: ({ id, body }) => ({
        url: `/owner/pgs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['OwnerListings', { type: 'OwnerListings', id }, 'PublicPgs'],
    }),
    deleteListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/owner/pgs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OwnerListings', 'PublicPgs'],
    }),
    updateProfile: builder.mutation<{ message: string }, UpdateProfilePayload>({
      query: (body) => ({
        url: '/owner/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['OwnerProfile'],
    }),
    updateAvatar: builder.mutation<{ message: string }, { publicId: string; url: string }>({
      query: (body) => ({
        url: '/owner/profile-image',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OwnerProfile'],
    }),
  }),
});

export const {
  useGetOwnerListingsQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = ownerApi;