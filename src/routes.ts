import { z } from 'zod';
import { userRepository } from './repositories/userRepository';
import {
  createUserSchema,
  errorResponseSchema,
  userSchema,
  validationErrorSchema,
} from './schemas/userSchemas';
import { loginSchema, tokenResponseSchema } from './schemas/authSchemas';
import { userService } from './services/userService';
import type { FastifyTypeInstance } from './types';

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
      const user = userRepository.findByEmail(email);

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
        app.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
}
