import { FastifyInstance } from 'fastify';
import ShortUniqueId from 'short-unique-id';
import { z, ZodError } from 'zod';
import { prisma } from '../lib/prisma';
import { ErrorResponse } from './dto/ErrorResponse';
import { authenticate } from '../plugins/authenticate';

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/polls',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      try {
        const createPollBody = z.object({
          title: z.string().min(3),
        });
        const { title } = createPollBody.parse(request.body);

        const generateCode = new ShortUniqueId({ length: 6 });
        const code = String(generateCode()).toUpperCase();

        await prisma.poll.create({
          data: {
            title,
            code,
            ownerId: request.user.sub,

            participants: {
              create: {
                userId: request.user.sub,
              },
            },
          },
        });

        return reply.status(201).send({ code });
      } catch (error) {
        if (error instanceof ZodError) {
          const errorResponse: ErrorResponse = {
            status: 400,
            type: 'Bad Request',
            message: error.message,
          };
          return reply.status(400).send(errorResponse);
        } else {
          const errorResponse: ErrorResponse = {
            status: 500,
            type: 'Internal Server Error',
            message:
              'Erro interno no servidor. Se persistir o problema contate o administrador',
          };
          console.error(error);
          return reply.status(500).send(errorResponse);
        }
      }
    }
  );

  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  fastify.get(
    '/polls/join',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const joinPollBody = z.object({
        code: z.string(),
      });
      const { code } = joinPollBody.parse(request.body);

      const poll = await prisma.poll.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      if (!poll) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Bolão não encontrado com o código informado',
        };
        return reply.status(400).send(errorResponse);
      }

      if (poll.participants.length > 0) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: 'Você já está participando deste bolão',
        };
        return reply.status(400).send(errorResponse);
      }

      // if (!poll.ownerId) {
      //   await prisma.poll.update({
      //     where: {
      //       id: poll.id,
      //     },
      //     data: {
      //       ownerId: request.user.sub,
      //     },
      //   });
      // }

      const participant = await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: request.user.sub,
        },
      });

      return reply.status(201).send(participant);
    }
  );

  fastify.get(
    '/polls',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const polls = await prisma.poll.findMany({
        where: {
          participants: {
            some: {
              userId: request.user.sub,
            },
          },
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { polls };
    }
  );

  fastify.get(
    '/polls/:id',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getPollParams = z.object({
        id: z.string(),
      });
      const { id } = getPollParams.parse(request.params);

      const poll = await prisma.poll.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { poll };
    }
  );
}
