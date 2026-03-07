import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().describe('Email do usuário para fazer login'),
});

export const tokenResponseSchema = z.object({
  token: z.string().describe('Token JWT gerado'),
});
