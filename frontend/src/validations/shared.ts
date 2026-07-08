import { z } from 'zod';

/**
 * Reusable validation schemas for form data using Zod.
 */

export const indianMobileRegex = /^[6-9]\d{9}$/;

export const phoneSchema = z
  .string()
  .min(1, 'Mobile number is required')
  .regex(
    indianMobileRegex,
    'Please enter a valid 10-digit Indian mobile number starting with 6-9'
  );

export const baseAuthValidation = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});