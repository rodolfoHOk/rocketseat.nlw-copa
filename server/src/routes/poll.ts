import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';
import { ErrorResponse } from './dto/ErrorResponse';
import { authenticate } from '../plugins/authenticate';
import { countPollUseCase } from '../use-cases/countPollUseCase';
import { getPollsUseCase } from '../use-cases/getPollsUseCase';
import { getPollByIdUseCase } from '../use-cases/getPollByIdUseCase';
import { joinPollUseCase } from '../use-cases/joinPollUseCase';
import { ValidationError } from '../errors/ValidationError';
import { createPollUseCase } from '../use-cases/createPollUseCase';

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/polls',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createPollBody = z.object({
        title: z.string().min(3),
      });

      try {
        const { title } = createPollBody.parse(request.body);

        const poll = await createPollUseCase(title, request.user.sub);
        return reply.status(201).send({ code: poll.code });
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

  fastify.get('/polls/count', async (request, reply) => {
    try {
      const count = await countPollUseCase();
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
    '/polls/join',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const joinPollBody = z.object({
        code: z.string(),
      });

      try {
        const { code } = joinPollBody.parse(request.body);

        const participant = await joinPollUseCase(code, request.user.sub);
        return reply.status(201).send(participant);
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

  fastify.get(
    '/polls',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      try {
        const polls = await getPollsUseCase(request.user.sub);
        return reply.status(200).send(polls);
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
    }
  );

  fastify.get(
    '/polls/:id',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const getPollParams = z.object({
        id: z.string(),
      });

      try {
        const { id } = getPollParams.parse(request.params);

        const poll = await getPollByIdUseCase(id);

        if (poll === null) {
          const errorResponse: ErrorResponse = {
            status: 404,
            type: 'Not Found',
            message: 'Poll not found',
          };
          return reply.status(404).send(errorResponse);
        }

        return reply.status(200).send(poll);
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
