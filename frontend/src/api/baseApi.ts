import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CACHE_TAGS_LIST } from './tagTypes';

/**
 * Base Redux Toolkit Query API layout anchored to same-origin routes (/api/*).
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: CACHE_TAGS_LIST,
  endpoints: () => ({}),
});