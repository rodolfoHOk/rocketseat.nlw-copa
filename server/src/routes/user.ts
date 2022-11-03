import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', async () => {
    const users = await prisma.user.findMany();

    return { users };
  });

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count();

    return { count };
  });
}
