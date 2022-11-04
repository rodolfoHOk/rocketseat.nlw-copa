import { Poll } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import { prisma } from '../lib/prisma';

export async function createPollUseCase(
  title: string,
  ownerId: string
): Promise<Poll> {
  const generateCode = new ShortUniqueId({ length: 6 });
  const code = String(generateCode()).toUpperCase();

  return await prisma.poll.create({
    data: {
      title,
      code,
      ownerId,

      participants: {
        create: {
          userId: ownerId,
        },
      },
    },
  });
}
