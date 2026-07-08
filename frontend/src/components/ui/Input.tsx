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
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          'w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20',
          error ? 'border-danger' : '',
          className
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
