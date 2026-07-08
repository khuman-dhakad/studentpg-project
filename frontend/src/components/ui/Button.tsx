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
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-brand text-cream hover:bg-brand-dark',
    secondary: 'border border-line bg-surface text-ink hover:bg-cream',
    ghost: 'bg-transparent text-ink hover:bg-cream',
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon ? <span>{icon}</span> : null}
      {children}
    </button>
  );
}
