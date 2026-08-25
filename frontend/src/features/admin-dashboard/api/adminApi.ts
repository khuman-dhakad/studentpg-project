import { baseApi } from '@/api/baseApi';
import { PG } from '@/types/pg.types';
import { AdminStats, AdminSuggestion } from '@/types/admin.types';
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { CACHE_TAGS } from '@/api/tagTypes';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
     query: () => ({
  url: BACKEND_ENDPOINTS.ADMIN.STATS,
  method: 'GET',
}),
      providesTags: [CACHE_TAGS.ADMIN_STATS],
    }),
    getPendingPgs: builder.query<PG[], void>({
      query: () => ({
  url: BACKEND_ENDPOINTS.ADMIN.PENDING_PGS,
  method: 'GET',
}),
      providesTags: [CACHE_TAGS.ADMIN_PENDING],
    }),
    getAllPgsAdmin: builder.query<PG[], void>({
      query: () => ({
  url: BACKEND_ENDPOINTS.ADMIN.PGS,
  method: 'GET',
}),
    }),
    approvePg: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: BACKEND_ENDPOINTS.ADMIN.APPROVE_PG(id),
        method: 'PUT',
      }),
      invalidatesTags: [
  CACHE_TAGS.ADMIN_PENDING,
  CACHE_TAGS.ADMIN_STATS,
  CACHE_TAGS.PUBLIC_PGS,
],
    }),
    rejectPg: builder.mutation<{ message: string }, string>({
      query: (id) => ({
       url: BACKEND_ENDPOINTS.ADMIN.REJECT_PG(id),
method: 'POST',
      }),
      invalidatesTags: [
  CACHE_TAGS.ADMIN_PENDING,
  CACHE_TAGS.ADMIN_STATS,
  CACHE_TAGS.PUBLIC_PGS,
],
    }),
    getAdminSuggestions: builder.query<AdminSuggestion[], void>({
      query: () => ({
  url: BACKEND_ENDPOINTS.ADMIN.SUGGESTIONS,
  method: 'GET',
}),
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