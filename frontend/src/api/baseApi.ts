import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { BACKEND_API_URL } from '@/constants/config';
import { CACHE_TAGS_LIST } from '@/api/tagTypes';

/* =========================================================
 * RAW BASE QUERY
 * ========================================================= */

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BACKEND_API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});

/* =========================================================
 * AUTH-AWARE BASE QUERY
 * ========================================================= */

const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(
    args,
    api,
    extraOptions
  );

  if (result.error?.status === 401) {
    console.warn(
      'Authentication required. Session cookie missing or expired.'
    );
  }

  return result;
};

/* =========================================================
 * BASE API
 * ========================================================= */

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: baseQueryWithAuthHandling,

  tagTypes: CACHE_TAGS_LIST,

  endpoints: () => ({}),
});