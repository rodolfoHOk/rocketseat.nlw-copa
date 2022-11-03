import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses', async () => {
    const guesses = await prisma.guess.findMany();

    return { guesses };
  });

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

    return { count };
  });
}
