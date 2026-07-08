import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines variant class strings using clsx and safely handles tailwind conflict resolutions.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}