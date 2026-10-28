import { describe, expect, it } from 'vitest';
import { registerSchema } from '../../src/features/auth/schemas/authSchemas';
import { normalizeIndianPhone } from '../../src/validations/shared';

describe('Fix A & SPG-QA-001: Frontend Owner Registration Schema Validation', () => {
  it('allows registration when WhatsApp number is omitted (optional field)', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.whatsappNumber).toBe('');
      expect(result.data.phone).toBe('9876543210');
    }
  });

  it('allows registration when WhatsApp number is empty string', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      whatsappNumber: '',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.whatsappNumber).toBe('');
    }
  });

  it('accepts and normalizes valid 10-digit Indian WhatsApp number', () => {
    const input = {
      name: 'Pooja Sharma',
      email: 'pooja@example.com',
      phone: '9876543210',
      whatsappNumber: '+91 98765 43211',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.whatsappNumber).toBe('9876543211');
    }
  });

  it('rejects invalid WhatsApp numbers that do not match 10 Indian digits starting with 6-9', () => {
    const input = {
      name: 'Pooja Sharma',
      email: 'pooja@example.com',
      phone: '9876543210',
      whatsappNumber: '12345',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.errors.map((e) => e.path.join('.'));
      expect(errorPaths).toContain('whatsappNumber');
    }
  });

  it('normalizes mobile autofill formats with +91, spaces, and hyphens', () => {
    expect(normalizeIndianPhone('+91 98765 43210')).toBe('9876543210');
    expect(normalizeIndianPhone('+91-98765-43210')).toBe('9876543210');
    expect(normalizeIndianPhone('919876543210')).toBe('9876543210');
    expect(normalizeIndianPhone('9876543210')).toBe('9876543210');

    const input = {
      name: 'Mobile User',
      email: 'mobile@example.com',
      phone: '+91 98765 43210',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe('9876543210');
    }
  });

  it('validates boundary name lengths: 2 chars passes, 1 char fails, >50 chars fails', () => {
    const validTwoChar = {
      name: 'Om',
      email: 'om@example.com',
      phone: '9876543210',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };
    expect(registerSchema.safeParse(validTwoChar).success).toBe(true);

    const invalidOneChar = {
      name: 'O',
      email: 'om@example.com',
      phone: '9876543210',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };
    const oneCharResult = registerSchema.safeParse(invalidOneChar);
    expect(oneCharResult.success).toBe(false);

    const invalidFiftyOneChar = {
      name: 'A'.repeat(51),
      email: 'om@example.com',
      phone: '9876543210',
      password: 'StrongPassword123',
      confirmPassword: 'StrongPassword123',
    };
    const fiftyOneResult = registerSchema.safeParse(invalidFiftyOneChar);
    expect(fiftyOneResult.success).toBe(false);
  });

  it('rejects passwords that do not match confirmPassword', () => {
    const input = {
      name: 'Mismatched User',
      email: 'mismatch@example.com',
      phone: '9876543210',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.errors.map((e) => e.message);
      expect(errorMessages).toContain('Passwords do not match');
    }
  });
});
