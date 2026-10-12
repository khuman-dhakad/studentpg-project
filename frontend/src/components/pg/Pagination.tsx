'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize = 8,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalElements <= 0 || totalPages <= 1) {
    return null;
  }

  const from = Math.min((currentPage - 1) * pageSize + 1, totalElements);
  const to = Math.min(currentPage * pageSize, totalElements);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) {
      return;
    }

    const next = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      next.delete('page');
    } else {
      next.set('page', String(pageNumber));
    }

    const query = next.toString();
    router.push(query ? `/search?${query}` : '/search');

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate pagination items with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Search results pagination"
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row"
    >
      <p className="text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-slate-800">{from}</span>–<span className="font-bold text-slate-800">{to}</span> of{' '}
        <span className="font-bold text-emerald-600">{totalElements}</span> properties
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-6 items-center justify-center text-xs font-bold text-slate-400 select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isCurrent = item === currentPage;

            return (
              <button
                key={item}
                type="button"
                onClick={() => goToPage(item)}
                aria-label={`Page ${item}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-[#059669] text-white shadow-2xs ring-2 ring-emerald-600/20'
                    : 'border border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
