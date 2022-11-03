import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorResponse } from '../routes/dto/ErrorResponse';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    const errorResponse: ErrorResponse = {
      status: 401,
      type: 'Unauthorized',
      message: 'Usuário não autorizado!',
    };
    reply.status(401).send(errorResponse);
  }
}
