# NLW Copa - Back-End Node.Js

> Evento NLW Copa da Rocketseat - Projeto do back-end

## ๐จโ๐ป Principais Tecnologias ๐ฉโ๐ป

- Typescript
- Node Js
- Fastify
- Prisma
- ERD (Entity Relationship Diagram)

### ๐ Bibliotecas adicionais ๐๏ธ

- @fastify/cors
- @fastify/jwt
- short-unique-id
- zod

## ๐ Guia ๐

- Iniciando um projeto Node: npm init -y
- Instalando o Typescript no projeto: npm i typescript -D
- Iniciando o Typescript no projeto: npx tsc --init
- Instalando o fastify: npm i fastify
- Instalando o tsx para build e run: npm i tsx -D
- Instalando o prisma: npm i prisma -D
- Instalando o prisma client: npm i @prisma/client
- Iniciando o prisma para usar o SQLite: npx prisma init --datasource-provider SQLite
- Gerar migration do banco de dados: npx prisma migrate dev
- Iniciar o prisma studio: npx prisma studio
- Instalando o prisma erd generator e mermaid cli: npm i prisma-erd-generator @mermaid-js/mermaid-cli -D
- Gerando ERD: npx prisma generate
- Instalando o fastify cors: npm i @fastify/cors
- Popular o banco de dados: npx prisma db seed

## ๐งพ ERD ๐งพ

<img src="prisma/ERD.svg" width="450"/>

## ๐ก ideias ๐ก

- create dto layer example: https://github.com/rodolfoHOk/rocketseat.nlw-esports/blob/main/server/src/dto/ad-dto.ts
- and move zod validation to use case layer

## ๐ Links para dos projetos do evento โจ

- [Projeto server](server)
- [Projeto web](web)
- [Projeto mobile](mobile)
