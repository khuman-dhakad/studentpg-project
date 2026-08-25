'use client';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  useEffect,
  useState,
} from 'react';

import {
  Search,
  MapPin,
  Building2,
  Loader2,
  X,
} from 'lucide-react';

import {
  useGetSearchSuggestionsQuery,
} from '@/features/pg-listing/api/pgApi';

import type {
  PGSuggestion,
} from '@/types/pg.types';


// =======================================================
// PROPS
// =======================================================

interface SearchBarProps {

  initialQuery?: string;

}


// =======================================================
// SEARCH BAR
// =======================================================

export function SearchBar({

  initialQuery = '',

}: SearchBarProps) {


  // =====================================================
  // NAVIGATION
  // =====================================================

  const router =
    useRouter();


  const params =
    useSearchParams();


  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [

    value,

    setValue,

  ] = useState(

    params.get('q') ||
    initialQuery

  );


  const [

    showSuggestions,

    setShowSuggestions,

  ] = useState(false);


  const [

    debounceQuery,

    setDebounceQuery,

  ] = useState('');


  // =====================================================
  // SYNC SEARCH INPUT WITH URL
  // =====================================================

  useEffect(() => {

    const urlQuery =
      params.get('q') || '';


    setValue(
      urlQuery ||
      initialQuery
    );


  }, [

    params,

    initialQuery,

  ]);


  // =====================================================
  // DEBOUNCE
  // =====================================================

  useEffect(() => {

    const timer =
      window.setTimeout(() => {

        setDebounceQuery(
          value.trim()
        );


      }, 300);


    return () => {

      window.clearTimeout(
        timer
      );

    };


  }, [

    value,

  ]);


  // =====================================================
  // SEARCH SUGGESTIONS
  // =====================================================

  const {

    data: suggestions = [],

    isFetching,

  } = useGetSearchSuggestionsQuery(

    debounceQuery,

    {

      skip:
        debounceQuery.length < 2,

    }

  );


  // =====================================================
  // SUBMIT SEARCH
  // =====================================================

  const submit = (

    term: string

  ) => {


    const normalized =
      term.trim();


    const next =
      new URLSearchParams(
        params.toString()
      );


    if (

      normalized

    ) {

      next.set(
        'q',
        normalized
      );


    } else {

      next.delete(
        'q'
      );

    }


    setShowSuggestions(
      false
    );


    const queryString =
      next.toString();


    router.push(

      queryString

        ? `/search?${queryString}`

        : '/search'

    );

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {


    setValue('');


    setDebounceQuery('');


    setShowSuggestions(
      false
    );


    const next =
      new URLSearchParams(
        params.toString()
      );


    next.delete(
      'q'
    );


    const queryString =
      next.toString();


    router.push(

      queryString

        ? `/search?${queryString}`

        : '/search'

    );

  };


  // =====================================================
  // SUGGESTION CLICK
  // =====================================================

  const handleSuggestionClick = (

    suggestion: PGSuggestion

  ) => {


    const searchText =
      suggestion.pgName;


    setValue(
      searchText
    );


    setShowSuggestions(
      false
    );


    submit(
      searchText
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        relative
        w-full
      "
    >


      {/* ============================================
          SEARCH CONTAINER
      ============================================= */}

      <div
        className="
          flex
          w-full
          items-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-1.5
          shadow-sm
          transition-all
          duration-300
          focus-within:border-teal-600
          focus-within:ring-4
          focus-within:ring-teal-500/10
        "
      >


        {/* SEARCH ICON */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-center
            pl-3.5
            pr-2
          "
        >

          <Search
            className="
              h-5
              w-5
              text-slate-400
            "
          />

        </div>


        {/* INPUT */}
        <input
          id="search-input"
          name="search"
          type="search"
          aria-label="Search by PG name, city or location"
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            setValue(nextValue);
            setShowSuggestions(nextValue.trim().length >= 2);
          }}
          onFocus={() => {
            if (value.trim().length >= 2) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submit(value);
            }
            if (event.key === 'Escape') {
              clearSearch();
            }
          }}
          placeholder="Search by PG name, city or location..."
          className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-xs font-medium text-slate-800 outline-none placeholder:text-xs placeholder:text-slate-400"
        />

        {/* CLEAR SEARCH BUTTON */}
        {value.trim().length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* LOADING */}
        {isFetching && (
          <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin text-teal-600" />
        )}

        {/* SEARCH BUTTON */}
        <button
          type="button"
          onClick={() => submit(value)}
          aria-label="Search properties"
          className="shrink-0 rounded-xl bg-teal-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-sm transition-all hover:bg-teal-700 active:scale-[0.98]"
        >
          Search
        </button>


      </div>


      {/* ============================================
          SUGGESTIONS
      ============================================= */}

      {showSuggestions &&

        value.trim().length >= 2 &&

        suggestions.length > 0 && (

          <div

            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-2
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "

          >

            {suggestions.map(

              (

                suggestion

              ) => (

                <button

                  key={
                    suggestion._id
                  }

                  type="button"

                  onClick={() =>

                    handleSuggestionClick(
                      suggestion
                    )

                  }

                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    border-b
                    border-slate-100
                    px-4
                    py-3
                    text-left
                    transition-colors
                    last:border-b-0
                    hover:bg-slate-50
                  "

                >


                  {/* ICON */}

                  <div

                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-teal-50
                    "

                  >

                    {suggestion.pgName

                      .toLowerCase()

                      .includes(

                        value.toLowerCase()

                      )

                      ? (

                        <Building2

                          className="
                            h-4
                            w-4
                            text-teal-600
                          "

                        />

                      ) : (

                        <MapPin

                          className="
                            h-4
                            w-4
                            text-teal-600
                          "

                        />

                      )

                    }

                  </div>


                  {/* CONTENT */}

                  <div

                    className="
                      min-w-0
                      flex-1
                    "

                  >

                    <p

                      className="
                        truncate
                        text-sm
                        font-bold
                        text-slate-800
                      "

                    >

                      {
                        suggestion.pgName
                      }

                    </p>


                    <p

                      className="
                        truncate
                        text-xs
                        text-slate-500
                      "

                    >

                      {[

                        suggestion.address,

                        suggestion.city,

                        suggestion.state,

                      ]

                        .filter(Boolean)

                        .join(', ')}

                    </p>

                  </div>


                </button>

              )

            )}

          </div>

        )

      }

    </div>

  );

}