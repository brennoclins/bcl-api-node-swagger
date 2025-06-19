import  { fastify } from "fastify"
import  { fastifyCors }  from "@fastify/cors"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { routes } from "./routes"
import { ZodTypeProvider } from "fastify-type-provider-zod"

const PORT = Number(process.env.PORT) || 3333

const app = fastify().withTypeProvider<ZodTypeProvider>()

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
        },
        
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

// rotas
app.register(routes)



app.listen({ port: PORT , host: '0.0.0.0' })
  .then(() => {
    console.log('Servidor rodando em http://localhost:3333')
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
