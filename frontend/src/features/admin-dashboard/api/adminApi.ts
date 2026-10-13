import { baseApi } from '@/api/baseApi';
import { PG } from '@/types/pg.types';
import { AdminStats, AdminSuggestion, AdminDashboardOverview } from '@/types/admin.types';
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
    getDashboardOverview: builder.query<AdminDashboardOverview, void>({
      query: () => ({
        url: BACKEND_ENDPOINTS.ADMIN.DASHBOARD_OVERVIEW,
        method: 'GET',
      }),
      providesTags: [CACHE_TAGS.ADMIN_STATS, CACHE_TAGS.ADMIN_PENDING],
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
        method: 'PATCH',
      }),
      invalidatesTags: [
        CACHE_TAGS.ADMIN_PENDING,
        CACHE_TAGS.ADMIN_STATS,
        CACHE_TAGS.PUBLIC_PGS,
      ],
    }),
    rejectPg: builder.mutation<{ message: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: BACKEND_ENDPOINTS.ADMIN.REJECT_PG(id),
        method: 'PATCH',
        body: { reason },
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
  useGetDashboardOverviewQuery,
  useGetPendingPgsQuery,
  useGetAllPgsAdminQuery,
  useApprovePgMutation,
  useRejectPgMutation,
  useGetAdminSuggestionsQuery,
} = adminApi;