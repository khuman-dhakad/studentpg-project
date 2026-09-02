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
        <label htmlFor={id} className="mb-1.5 block text-xs font-black text-slate-700">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        className={cn(
          'min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10',
          error ? 'border-rose-500' : '',
          className
        )}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}
