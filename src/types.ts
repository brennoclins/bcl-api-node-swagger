import type {
  FastifyBaseLogger,
  FastifyInstance,
  type preHandlerHookHandler,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import '@fastify/jwt';

export type FastifyTypeInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; name: string };
    user: { sub: string; name: string };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: preHandlerHookHandler;
  }
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}
