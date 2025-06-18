import  { fastify } from "fastify"
import  { fastifyCors }  from "@fastify/cors"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import {fastifySwagger} from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"


const app = fastify()

// Faz a validação dos dados
app.setValidatorCompiler(validatorCompiler)
// Faz a serialização dos dados de resposta do backend
app.setSerializerCompiler(serializerCompiler)

app.register( fastifyCors, { origin: '*'})

app.register(fastifySwagger, {
    openapi:{
        info: {
            title: 'Typed API',
            version: '1.0.0'
        }
    }
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

// rotas
app.get('/', () => {
    return 'Olá Mundo!'
})

app.listen({ port: 3333 }).then(() => {
console.log(`Servidor rodando em http://localhost:3333`);

})