import { z } from 'zod';

/**
 * Auth schemas — shared between web (react-hook-form) and api (Nest pipe).
 * Keep messages user-facing; the api echoes them through to the form.
 */

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required.')
  .max(254, 'Email is too long.')
  .email('Please enter a valid email address.');

/**
 * Password policy:
 *  - min 12 chars (OWASP modern recommendation, also matches UI hint)
 *  - max 128 chars (defend against DoS via massive argon2 input)
 *  - must contain at least one letter and one digit (basic shape check —
 *    we lean on length + hash cost more than character class rules).
 */
export const passwordSchema = z
  .string()
  .min(12, 'Use at least 12 characters.')
  .max(128, 'Password is too long.')
  .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), {
    message: 'Use at least one letter and one number.',
  });

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Required.')
  .max(80, 'Too long.');

export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    company: z
      .string()
      .trim()
      .max(120)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don’t match.',
    path: ['confirmPassword'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Public user shape — never expose passwordHash. */
export const publicUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().nullable(),
  locale: z.string(),
  createdAt: z.string(),
});
export type PublicUser = z.infer<typeof publicUserSchema>;
