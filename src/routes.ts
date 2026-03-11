import { z } from 'zod';
import { userRepository } from './repositories/userRepository.js';
import { loginSchema, tokenResponseSchema } from './schemas/authSchemas.js';
import {
  createUserSchema,
  errorResponseSchema,
  updateUserSchema,
  userParamsSchema,
  userSchema,
  validationErrorSchema,
} from './schemas/userSchemas.js';
import { userService } from './services/userService.js';
import type { FastifyTypeInstance } from './types.js';

export async function routes(app: FastifyTypeInstance) {
  app.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        description: 'Autentica o usuário e retorna o token JWT',
        body: loginSchema.strict(),
        response: {
          200: tokenResponseSchema,
          401: errorResponseSchema,
          400: validationErrorSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return reply.status(401).send({ error: 'Credenciais inválidas' });
      }

      const token = app.jwt.sign(
        { sub: user.id, name: user.name },
        { expiresIn: '1h' }, // opcional: tempo de vida
      );

      return reply.send({ token });
    },
  );

  app.get(
    '/users',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['users'],
        description: 'List users',
        security: [{ bearerAuth: [] }],
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
      onRequest: [app.authenticate],
      schema: {
        tags: ['users'],
        description: 'Create a new user',
        security: [{ bearerAuth: [] }],
        body: createUserSchema.strict(),
        response: {
          201: userSchema,
          400: validationErrorSchema,
          401: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      // A validação do Zod é tratada automaticamente pelo Fastify antes de chegar aqui.
      // Este try/catch lida com possíveis erros da camada de serviço (ex: falha no banco de dados).
      try {
        const newUser = await userService.createUser(request.body);
        return reply.status(201).send(newUser);
      } catch (error) {
        if (error instanceof Error && error.message === 'User already exists') {
          return reply.status(409).send({ error: error.message });
        }
        app.log.error(error, 'Error creating user');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );

  app.get(
    '/users/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['users'],
        description: 'Busca um usuário pelo seu ID.',
        security: [{ bearerAuth: [] }],
        params: userParamsSchema,
        response: {
          200: userSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const user = await userService.findById(request.params.id);
        return reply.send(user);
      } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
          return reply.status(404).send({ error: error.message });
        }
        app.log.error(error, 'Error finding user by ID');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );

  app.patch(
    '/users/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['users'],
        description: 'Atualiza os dados de um usuário (parcialmente).',
        security: [{ bearerAuth: [] }],
        params: userParamsSchema,
        body: updateUserSchema.strict(),
        response: {
          200: userSchema,
          400: validationErrorSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const updatedUser = await userService.updateUser(request.params.id, request.body);
        return reply.send(updatedUser);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'User not found') {
            return reply.status(404).send({ error: error.message });
          }
          if (error.message === 'Email already in use by another user') {
            return reply.status(409).send({ error: error.message });
          }
        }
        app.log.error(error, 'Error updating user');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );

  app.delete(
    '/users/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['users'],
        description: 'Deleta um usuário pelo seu ID.',
        security: [{ bearerAuth: [] }],
        params: userParamsSchema,
        response: {
          204: z.null({ description: 'No Content' }),
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        await userService.deleteUser(request.params.id);
        return reply.status(204);
      } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
          return reply.status(404).send({ error: error.message });
        }
        app.log.error(error, 'Error deleting user');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
}
