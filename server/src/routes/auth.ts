import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../plugins/authenticate';
import { authenticateUserUseCase } from '../usecases/authenticateUserUseCase';

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

  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });
    const { access_token } = createUserBody.parse(request.body);

    return await authenticateUserUseCase(access_token, fastify.jwt);
  });
}
