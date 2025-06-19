import { z } from "zod";
import type { FastifyTypeInstance } from "./types";
import { randomUUID } from "node:crypto";

interface IUsers {
    id: string
    name: string
    email: string
}

const users: IUsers[] = [
    {
        id: randomUUID(),
        name: 'Brenno',
        email: 'b@bcl',
    }
]

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
})

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email()
})



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
                201: z.null().describe('User created')
            }
        },
    }, async (request, reply) => {
        const { name, email } = request.body
        
        return reply.status(201).send()
    })
    
}