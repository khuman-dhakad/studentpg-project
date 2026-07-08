import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, id, ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        className={cn(
          'min-h-28 w-full rounded-2xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20',
          error ? 'border-danger' : '',
          className
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
