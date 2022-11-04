import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../plugins/authenticate';
import { getGamesIncludeUserGuessUseCase } from '../usecases/getGamesIncludeUserGuessUseCase';

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/polls/:id/games',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getPollParams = z.object({
        id: z.string(),
      });
      const { id } = getPollParams.parse(request.params);

      return getGamesIncludeUserGuessUseCase(id, request.user.sub);
    }
  );
}
