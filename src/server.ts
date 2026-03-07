import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { routes } from './routes';

const PORT = Number(process.env.PORT) || 3333;

export function build() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  // Configurações do Fastify
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error, _, reply) => {
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

    app.log.error(error); // Log unexpected errors
    return reply.status(500).send({ message: 'Internal Server Error' });
  });

  // Plugins
  app.register(fastifyCors, { origin: '*' });
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Typed API',
        version: '1.0.0',
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
