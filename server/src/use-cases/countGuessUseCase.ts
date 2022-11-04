import { prisma } from '../lib/prisma';

export async function countGuessUseCase(): Promise<{ count: number }> {
  const count = await prisma.guess.count();
  return { count };
}
