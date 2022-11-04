import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';
import { AuthenticationError } from '../errors/AuthenticationError';
import { authenticate } from '../plugins/authenticate';
import { authenticateUserUseCase } from '../use-cases/authenticateUserUseCase';
import { ErrorResponse } from './dto/ErrorResponse';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/users/me',
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return { user: request.user };
    }
  );

  fastify.post('/users', async (request, reply) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });
    let access_token = '';
    try {
      access_token = createUserBody.parse(request.body).access_token;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ErrorResponse = {
          status: 400,
          type: 'Bad Request',
          message: error.message,
        };
        return reply.status(400).send(errorResponse);
      }
    }

    try {
      const appToken = await authenticateUserUseCase(access_token, fastify.jwt);
      return reply.status(200).send(appToken);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        const errorResponse: ErrorResponse = {
          status: 401,
          type: 'Unauthorized',
          message: error.message,
        };
        return reply.status(401).send(errorResponse);
      } else if (error instanceof ZodError) {
        console.error(error.message);
        const errorResponse: ErrorResponse = {
          status: 500,
          type: 'Internal Server Error',
          message:
            'Internal Server Error. If the problem persists, contact your administrator',
        };
        return reply.status(500).send(errorResponse);
      } else {
        console.error(error);
        const errorResponse: ErrorResponse = {
          status: 500,
          type: 'Internal Server Error',
          message:
            'Erro interno no servidor. If the problem persists, contact your administrator',
        };
        return reply.status(500).send(errorResponse);
      }
    }
  });
}
