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

export const errorResponseSchema = z.object({
  error: z.string().describe('Error message'),
});

//
export const validationErrorSchema = z.object({
  error: z.object({
    fieldErrors: z.record(z.array(z.string())),
    formErrors: z.array(z.string()),
  }),
});
