import  fastifly  from "fastify"
import  fastiflyCors   from "@fastify/cors"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"


const app = fastifly()

// Faz a validação dos dados
app.setValidatorCompiler(validatorCompiler)
// Faz a serialização dos dados de resposta do backend
app.setSerializerCompiler(serializerCompiler)

app.register( fastiflyCors, { origin: '*'})

app.listen({ port: 3333 }).then(() => {
console.log(`Servidor rodando em http://localhost:3333`);

})