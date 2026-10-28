import { z } from 'zod';

/**
 * Reusable validation schemas for form data using Zod.
 */

export const indianMobileRegex = /^[6-9]\d{9}$/;

export const normalizeIndianPhone = (val: string): string => {
  if (!val) return '';
  const digits = val.replace(/[\s-]/g, '');
  if (digits.startsWith('+91')) {
    return digits.slice(3);
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return digits.slice(2);
  }
  return digits;
};

export const phoneSchema = z
  .string()
  .min(1, 'Mobile number is required')
  .transform(normalizeIndianPhone)
  .pipe(
    z.string().regex(
      indianMobileRegex,
      'Please enter a valid 10-digit Indian mobile number starting with 6-9'
    )
  );

export const baseAuthValidation = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
