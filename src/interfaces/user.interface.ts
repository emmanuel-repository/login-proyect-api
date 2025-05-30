import { z } from 'zod';

export const getUserByIdSchema = z.object({
  id: z.number()
});

export const createUserSchema = z.object({
  full_name: z.string(),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.string()
});

export const updateUserSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  email: z.string().email({ message: 'Invalid email format' }),
  role: z.string()
});

export const updateUserPasswordSchema = z.object({
  id: z.number(),
  oldPassword: z.string(),
  newPassword: z.string(),
});