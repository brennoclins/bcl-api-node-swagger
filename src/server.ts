import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { type FastifyReply, type FastifyRequest, fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { routes } from './routes.js';

const PORT = Number(process.env.PORT) || 3333;

export function build() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  // Configurações do Fastify
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: error.flatten() });
    }

    // Identifica e trata Erros de Validação do Fastify (Zod provider)
    if (hasZodFastifySchemaValidationErrors(error)) {
      const fieldErrors: Record<string, string[]> = {};
      const formErrors: string[] = [];

      for (const validation of error.validation) {
        // FastifyTypeProviderZod embute o ZodIssue real em params.issue
        const issue = validation.params?.issue as any;
        if (issue) {
          if (issue.code === 'unrecognized_keys' && Array.isArray(issue.keys)) {
            for (const key of issue.keys) {
              if (!fieldErrors[key]) fieldErrors[key] = [];
              fieldErrors[key].push(issue.message);
            }
          } else if (Array.isArray(issue.path) && issue.path.length > 0) {
            const path = String(issue.path[0]);
            if (!fieldErrors[path]) {
              fieldErrors[path] = [];
            }
            fieldErrors[path].push(issue.message);
          } else {
            formErrors.push(validation.message);
          }
        } else {
          formErrors.push(validation.message);
        }
      }

      return reply.status(400).send({
        error: {
          formErrors,
          fieldErrors,
        },
      });
    }

    // NEW: Handle JSON parsing errors specifically
    if (error instanceof SyntaxError && 'statusCode' in error && error.statusCode === 400) {
      // Fastify's body parser often sets statusCode to 400 for JSON parsing errors
      app.log.warn(error, 'JSON parsing error');
      return reply.status(400).send({ error: 'Invalid JSON payload' });
    }

    // Trata erros de cliente (como os do JWT) que já vêm com statusCode
    if (
      error &&
      typeof error === 'object' &&
      'statusCode' in error &&
      typeof error.statusCode === 'number' &&
      error.statusCode >= 400 &&
      error.statusCode < 500
    ) {
      app.log.warn(error);
      const message = 'message' in error ? String(error.message) : 'Client Error';
      return reply.status(error.statusCode).send({
        error: message,
      });
    }

    app.log.error(error, 'Internal server error'); // Log unexpected errors with more context
    return reply.status(500).send({ error: 'Internal server error' }); // Changed message to 'error' for consistency
  });

  // Plugins
  app.register(fastifyCors, { origin: '*' });
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Typed API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret', // Use dotenv se preferir
  });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
  });

  // Rotas
  app.register(routes);

  return app;
}

// Inicialização condicional do servidor
if (process.env.NODE_ENV !== 'test') {
  const app = build();
  app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação em http://localhost:${PORT}/docs`);
  });
}
