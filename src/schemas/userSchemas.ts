import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const userParamsSchema = z.object({
  id: z.string().uuid('O ID do usuário deve ser um UUID válido.'),
});

export const errorResponseSchema = z.object({
  error: z.string().describe('Error message'),
});

//
export const validationErrorSchema = z.object({
  error: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.array(z.string()).optional()),
  }),
});
