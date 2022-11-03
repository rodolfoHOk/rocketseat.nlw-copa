import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';
import { ErrorResponse } from './dto/ErrorResponse';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

    return { count };
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
      const { pollId, gameId } = createGuessParams.parse(request.params);

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            pollId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Você não está permitido a fazer um palpite neste bolão.',
        };
        return reply.status(400).send(errorResponse);
      }

      let guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Você já fez um palpite neste jogo neste bolão.',
        };
        return reply.status(400).send(errorResponse);
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Jogo não encontrado',
        };
        return reply.status(400).send(errorResponse);
      }

      if (game.date < new Date()) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Você não pode fazer um palpite após a data do jogo.',
        };
        return reply.status(400).send(errorResponse);
      }

      guess = await prisma.guess.create({
        data: {
          firstTeamPoints,
          secondTeamPoints,
          gameId,
          participantId: participant.id,
        },
      });

      return reply.status(201).send(guess);
    }
  );
}
