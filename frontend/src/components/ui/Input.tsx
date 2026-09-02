import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-xs font-black text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10',
          error ? 'border-rose-500' : '',
          className
        )}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}
