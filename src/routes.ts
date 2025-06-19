import { z } from 'zod';
import { userRepository } from './repositories/userRepository';
import {
  createUserSchema,
  errorResponseSchema,
  userSchema,
  validationErrorSchema,
} from './schemas/userSchemas';
import { userService } from './services/userService';
import type { FastifyTypeInstance } from './types';

export async function routes(app: FastifyTypeInstance) {
  app.get(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'List users',
        response: {
          200: z.array(userSchema),
          500: errorResponseSchema,
        },
      },
    },
    async () => {
      return userRepository.findAll();
    },
  );

  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Create a new user',
        body: createUserSchema,
        response: {
          201: userSchema,
          400: validationErrorSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const newUser = await userService.createUser(request.body);
        return reply.status(201).send(newUser);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.flatten() });
        }
        app.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
}
