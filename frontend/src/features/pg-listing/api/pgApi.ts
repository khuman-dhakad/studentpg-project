import { baseApi } from '@/api/baseApi';
import { PG, PGFilterParams } from '@/types/pg.types';

export const pgApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicPgs: builder.query<PG[], PGFilterParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              params.append(key, String(val));
            }
          });
        }
        return `/public/pgs?${params.toString()}`;
      },
      providesTags: ['PublicPgs'],
    }),
    getPgById: builder.query<PG, string>({
      query: (id) => `/owner/pgs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'OwnerListings' as const, id }],
    }),
    getSearchSuggestions: builder.query<string[], string>({
      query: (city) => `/public/search-suggestions?city=${encodeURIComponent(city)}`,
    }),
    executeTextSearch: builder.query<PG[], string>({
      query: (term) => `/public/search?q=${encodeURIComponent(term)}`,
    }),
  }),
});

export const {
  useGetPublicPgsQuery,
  useGetPgByIdQuery,
  useGetSearchSuggestionsQuery,
  useExecuteTextSearchQuery,
} = pgApi;