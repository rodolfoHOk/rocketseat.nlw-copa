import { FastifyInstance } from 'fastify';
import { countUserUseCase } from '../use-cases/countUserUseCase';
import { ErrorResponse } from './dto/ErrorResponse';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users/count', async (request, reply) => {
    try {
      const count = await countUserUseCase();
      return reply.status(200).send(count);
    } catch (error) {
      console.error(error);
      const errorResponse: ErrorResponse = {
        status: 500,
        type: 'Internal Server Error',
        message:
          'Internal Server Error. If the problem persists, contact your administrator',
      };
      return reply.status(500).send(errorResponse);
    }
  });
}
