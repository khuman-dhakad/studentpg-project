import { z } from 'zod';
import { baseAuthValidation, phoneSchema } from '@/validations/shared';

export const loginSchema = baseAuthValidation;

export const registerSchema = baseAuthValidation
  .extend({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    phone: phoneSchema,
    whatsappNumber: z.string().optional(),
    confirmPassword: z.string().min(8, 'Confirm password must match'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;