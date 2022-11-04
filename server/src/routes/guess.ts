import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';
import { ValidationError } from '../errors/ValidationError';
import { authenticate } from '../plugins/authenticate';
import { countGuessUseCase } from '../use-cases/countGuessUseCase';
import { createGuessUseCase } from '../use-cases/createGuessUseCase';
import { ErrorResponse } from './dto/ErrorResponse';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async (request, reply) => {
    try {
      const count = await countGuessUseCase();
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

  fastify.post(
    '/polls/:pollId/games/:gameId/guesses',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });
      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });
      try {
        const { pollId, gameId } = createGuessParams.parse(request.params);
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
          request.body
        );

        const guess = await createGuessUseCase(
          pollId,
          gameId,
          request.user.sub,
          firstTeamPoints,
          secondTeamPoints
        );
        return reply.status(201).send(guess);
      } catch (error) {
        if (error instanceof ZodError || error instanceof ValidationError) {
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
