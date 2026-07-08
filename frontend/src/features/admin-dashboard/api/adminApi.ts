import { baseApi } from '@/api/baseApi';
import { PG } from '@/types/pg.types';
import { AdminStats, AdminSuggestion } from '@/types/admin.types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
    getPendingPgs: builder.query<PG[], void>({
      query: () => '/admin/pending',
      providesTags: ['AdminPending'],
    }),
    getAllPgsAdmin: builder.query<PG[], void>({
      query: () => '/admin/pgs',
    }),
    approvePg: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminPending', 'AdminStats', 'PublicPgs'],
    }),
    rejectPg: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminPending', 'AdminStats', 'PublicPgs'],
    }),
    getAdminSuggestions: builder.query<AdminSuggestion[], void>({
      query: () => '/admin/suggestions',
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetPendingPgsQuery,
  useGetAllPgsAdminQuery,
  useApprovePgMutation,
  useRejectPgMutation,
  useGetAdminSuggestionsQuery,
} = adminApi;