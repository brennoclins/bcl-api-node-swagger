<p align="center">
  <img src="./noproject/01_intro.png" alt="Intro da API" width="100%"/>
</p>

# 🚀 API Node.js Auto-documentável com Fastify, Zod e Swagger

**Autor:** Brenno C. Lins

Este repositório é uma demonstração completa de como construir uma API REST moderna, tipada de ponta a ponta, altamente performática e com documentação gerada automaticamente. O projeto foi evoluído para incluir testes robustos e tratamento avançado de erros.

## 🛠️ Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)**: Base da aplicação, garantindo tipagem estática e segurança.
- **[Fastify v5](https://fastify.dev/)**: Framework HTTP extremamente rápido e com um ecossistema moderno de plugins.
- **[Zod](https://zod.dev/)**: Declaração de schemas e validação de dados. Integrado perfeitamente com o Fastify para tipagem na entrada e saída das rotas.
- **[Swagger / OpenAPI](https://swagger.io/)**: Documentação interativa gerada automaticamente a partir dos schemas do Zod digitais nas rotas (`@fastify/swagger` e `@fastify/swagger-ui`).
- **[Vitest](https://vitest.dev/)**: Framework de testes ultra-rápido, utilizado aqui para testes Unitários e testes End-to-End (E2E).
- **[Biome](https://biomejs.dev/)**: Ferramenta rápida e moderna adotada para padronização, formatação e lint de código (substituindo Prettier + ESLint).
- **[tsx](https://tsx.is/)**: Execução de TypeScript nativa para o ambiente de desenvolvimento.

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura limpa em camadas para separação clara de responsabilidades:

- `src/schemas`: Definição de todos os schemas (Zod). É aqui que validamos e tipamos os dados.
- `src/repositories`: Camada de acesso aos dados. Atualmente utiliza um banco de dados em memória (um simples array) puro para demonstração de manipulação.
- `src/services`: Camada de regras de negócio, onde a lógica principal atua como ponte entre a entrada/saída HTTP e os repositórios de sistema.
- `src/routes.ts`: Definições de rotas do Fastify integradas ao Zod para auto-validação (`fastify-type-provider-zod`).
- `src/server.ts`: Configuração e Bootstrapping global da API, incluindo o Custom Error Handler para Erros de Validação.
- `tests/`: Separação estrutural com testes End-to-End (`e2e/`) e Unitários (`services/`).

## 🤖 Assistente de IA Auxiliando no Desenvolvimento

Este projeto tira vantagem do uso de agentes e assistentes de IA diretamente no fluxo de código. As diretrizes de estrutura, validação explícita com o Zod, regras e convenções do time estão codificadas dentro do um arquivo `.clinerules`, garantindo que o desenvolvimento escalonado mantenha a essência arquitetural requerida.

## ⚙️ Instruções para rodar o projeto

### 🔧 Pré-requisitos

- Node.js instalado (versão 20 ou superior recomendada)
- Gerenciador de pacotes `npm` ou `pnpm`
- VS Code (opcional, mas recomendado)

### 📦 Instalação

Clone o projeto e instale as dependências:

```bash
git clone https://github.com/brennoclins/bcl-api-node-swagger.git
cd bcl-api-node-swagger
npm install
```

### 🚀 Executando o Servidor de Desenvolvimento

```bash
npm run dev
```

A API estará online e monitorando alterações de arquivo no endereço:
`http://localhost:3333`

### 📘 Acessando a Documentação (Swagger UI)

Após iniciar o servidor, a documentação interativa gerada automaticamente pelos schemas estará acessível em:
`http://localhost:3333/docs`

### 🧪 Executando os Testes

Este projeto possui uma base de testes sólida utilizando **Vitest**, que garante que os endpoints e regras de negócios continuem integramos após cada modificação, incluindo validação rigorosa de payloads nas rotas:

- Executar testes uma única vez:
```bash
npm run test
```
- Executar testes em modo "watch" (observação):
```bash
npm run test:watch
```
- Executar testes utilizando a Interface Gráfica nativa no navegador do Vitest:
```bash
npm run test:ui
```

### ✨ Formatando e Validando Código (Linter)

O **Biome** está configurado para garantir que todos contribuam com o mesmo padrão visual.

- Corrigir e formatar todo o código automaticamente:
```bash
npm run format
```
- Apenas verificar a formatação e as regras do Linter:
```bash
npm run lint
```

## 🔗 Links Relevantes
- [Demo e Explicação Originais (YouTube)](https://www.youtube.com/watch?v=mULWHLquYP0)
