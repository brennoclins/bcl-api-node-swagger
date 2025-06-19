import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { routes } from './routes';

const PORT = Number(process.env.PORT) || 3333;

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Configurações do Fastify
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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

// Rotas
app.register(routes);

// Inicialização condicional do servidor
if (process.env.NODE_ENV !== 'test') {
  app
    .listen({ port: PORT, host: '0.0.0.0' })
    .then(() => {
      console.log('Servidor rodando em http://localhost:3333');
    })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
}
