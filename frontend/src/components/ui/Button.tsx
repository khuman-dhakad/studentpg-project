import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer';
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-98',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 active:scale-98',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100/70',
  };
  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 text-xs font-black uppercase tracking-wider',
    lg: 'h-12 px-6 text-sm',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon ? <span>{icon}</span> : null}
      {children}
    </button>
  );
}
