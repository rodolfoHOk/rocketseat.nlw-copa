import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import { z, ZodError } from 'zod';
import ShortUniqueId from 'short-unique-id';

interface ErrorResponse {
  status: number;
  type: string;
  message: string;
}

const prisma = new PrismaClient({
  log: ['query'],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get('/users', async () => {
    const users = await prisma.user.findMany();

    return { users };
  });

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count();

    return { count };
  });

  fastify.post('/polls', async (request, reply) => {
    try {
      const createPollBody = z.object({
        title: z.string().min(3),
        ownerId: z.string().cuid(),
      });
      const { title, ownerId } = createPollBody.parse(request.body);

      const existUser = await prisma.user.findUnique({
        where: {
          id: ownerId,
        },
      });

      if (existUser === null) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Informed owner not found',
        };
        return reply.status(400).send(errorResponse);
      }

      const generateCode = new ShortUniqueId({ length: 6 });
      const code = String(generateCode()).toUpperCase();

      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId,
        },
      });

      return reply.status(201).send({ code });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(error.message);
      } else {
        console.error(error);
        return reply.status(500);
      }
    }
  });

  fastify.get('/polls', async () => {
    const polls = await prisma.poll.findMany();

    return { polls };
  });

  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  fastify.get('/guesses', async () => {
    const guesses = await prisma.guess.findMany();

    return { guesses };
  });

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0',
  });
}

bootstrap();
