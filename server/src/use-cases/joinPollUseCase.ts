import { Participant } from '@prisma/client';
import { ValidationError } from '../errors/ValidationError';
import { prisma } from '../lib/prisma';

export async function joinPollUseCase(
  code: string,
  userId: string
): Promise<Participant> {
  const poll = await prisma.poll.findUnique({
    where: {
      code,
    },
    include: {
      participants: {
        where: {
          userId,
        },
      },
    },
  });

  if (!poll) {
    throw new ValidationError('Poll not found');
  }

  if (poll.participants.length > 0) {
    throw new ValidationError('You are already participating in this pool');
  }

  return await prisma.participant.create({
    data: {
      pollId: poll.id,
      userId,
    },
  });
}
