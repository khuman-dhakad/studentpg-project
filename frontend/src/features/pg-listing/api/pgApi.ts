 import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { CACHE_TAGS } from '@/api/tagTypes';
import { baseApi } from '@/api/baseApi';

import type {
  PG,
  PGFilterParams,
  PGSuggestion,
} from '@/types/pg.types';

export const pgApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ==========================================
    // GET PUBLIC PG LISTINGS
    // ==========================================

    getPublicPgs: builder.query<
      PG[],
      PGFilterParams | void
    >({

      query: (filters) => {

        const params = new URLSearchParams();

        if (filters) {

          Object.entries(filters).forEach(
            ([key, value]) => {

              if (
                value !== undefined &&
                value !== null &&
                value !== ''
              ) {

                params.append(
                  key,
                  String(value)
                );

              }

            }
          );

        }

        return {
  url: `${BACKEND_ENDPOINTS.STUDENT.PGS}?${params.toString()}`,
  method: 'GET',
};
      },

      providesTags: [CACHE_TAGS.PUBLIC_PGS],
    }),


    // ==========================================
    // GET PG BY ID
    // ==========================================

    getPgById: builder.query<
      PG,
      string
    >({

     query: (id) => ({
  url: BACKEND_ENDPOINTS.STUDENT.BY_ID(id),
  method: 'GET',
}),

      providesTags: (
        _result,
        _error,
        id
      ) => [
        {
          type: CACHE_TAGS.OWNER_LISTINGS,
          id,
        },
      ],
    }),


    // ==========================================
    // SEARCH AUTOCOMPLETE SUGGESTIONS
    // ==========================================

    getSearchSuggestions: builder.query<
      PGSuggestion[],
      string
    >({

      query: (query) =>
        `${BACKEND_ENDPOINTS.STUDENT.SEARCH_SUGGESTIONS}?q=${encodeURIComponent(query)}`

    }),


    // ==========================================
    // FULL TEXT SEARCH
    // ==========================================

    executeTextSearch: builder.query<
      PG[],
      string
    >({

      query: (term) =>
        `${BACKEND_ENDPOINTS.SEARCH.TEXT}?q=${encodeURIComponent(term)}`,

    }),

  }),
});


export const {
  useGetPublicPgsQuery,
  useGetPgByIdQuery,
  useGetSearchSuggestionsQuery,
  useExecuteTextSearchQuery,
} = pgApi;