import { baseApi } from '@/api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    session: builder.query<{ isAuthenticated: boolean; user: any; profile: any }, void>({
      query: () => '/auth/session',
      providesTags: ['OwnerProfile'],
    }),
    ownerLogin: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/owner/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['OwnerProfile', 'OwnerListings'],
    }),
    ownerRegister: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/auth/owner/register',
        method: 'POST',
        body: userData,
      }),
    }),
    adminLogin: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['AdminStats', 'AdminPending'],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/owner/logout',
        method: 'POST',
      }),
      invalidatesTags: ['OwnerProfile', 'OwnerListings', 'AdminStats', 'AdminPending'],
    }),
  }),
});

export const {
  useSessionQuery,
  useOwnerLoginMutation,
  useOwnerRegisterMutation,
  useAdminLoginMutation,
  useLogoutMutation,
} = authApi;