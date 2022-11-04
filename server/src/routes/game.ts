import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';
import { authenticate } from '../plugins/authenticate';
import { getGamesUseCase } from '../use-cases/getGamesUseCase';
import { ErrorResponse } from './dto/ErrorResponse';

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/polls/:id/games',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const getPollParams = z.object({
        id: z.string(),
      });
      try {
        const { id } = getPollParams.parse(request.params);

        const games = await getGamesUseCase(id, request.user.sub);
        return reply.status(200).send(games);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorResponse: ErrorResponse = {
            status: 400,
            type: 'Bad Request',
            message: error.message,
          };
          return reply.status(400).send(errorResponse);
        } else {
          console.error(error);
          const errorResponse: ErrorResponse = {
            status: 500,
            type: 'Internal Server Error',
            message:
              'Internal Server Error. If the problem persists, contact your administrator',
          };
          return reply.status(500).send(errorResponse);
        }
      }
    }
  );
}
