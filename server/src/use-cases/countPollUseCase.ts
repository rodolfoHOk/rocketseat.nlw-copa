import { prisma } from '../lib/prisma';

export async function countPollUseCase(): Promise<{ count: number }> {
  const count = await prisma.poll.count();
  return { count };
}
