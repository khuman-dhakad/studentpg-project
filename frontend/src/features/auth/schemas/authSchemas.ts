import { z } from 'zod';
import { baseAuthValidation, phoneSchema, indianMobileRegex, normalizeIndianPhone } from '../../../validations/shared';

export const loginSchema = baseAuthValidation;

export const registerSchema = baseAuthValidation
  .extend({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters'),
    phone: phoneSchema,
    whatsappNumber: z
      .string()
      .optional()
      .transform((val) => (val ? normalizeIndianPhone(val) : ''))
      .pipe(
        z.string().refine((val) => val === '' || indianMobileRegex.test(val), {
          message: 'Please enter a valid 10-digit Indian WhatsApp number starting with 6-9',
        })
      ),
    confirmPassword: z.string().min(8, 'Confirm password must match'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
