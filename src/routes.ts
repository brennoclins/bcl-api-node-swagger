import { z } from "zod";
import type { FastifyTypeInstance } from "./types";
import { randomUUID } from "node:crypto";
import { createUserSchema, errorResponseSchema, userSchema, validationErrorSchema } from "./schemas/userSchemas";

interface IUsers {
    id: string
    name: string
    email: string
}

const users: IUsers[] = [
    {
        id: randomUUID(),
        name: 'Brenno',
        email: 'b@bcl.com',
    }
]

export async function routes(app: FastifyTypeInstance){
    app.get('/users', {
        schema: {
            tags: ['users'],
            description: 'List users',
            response: {
                200: z.array(userSchema)
            }
        },
    }, () => {
        return users
    }),

   app.post('/users', {
    schema: {
        tags: ['users'],
        description: 'Create a new user',
        body: createUserSchema,
        response: {
        201: userSchema,
        400: validationErrorSchema,
        500: errorResponseSchema
        }
    }
    }, async (request, reply) => {
    const parsed = createUserSchema.safeParse(request.body)

    if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const { name, email } = parsed.data
    const newUser = { id: randomUUID(), name, email }

    users.push(newUser)
    return reply.status(201).send(newUser)
    })
    
}