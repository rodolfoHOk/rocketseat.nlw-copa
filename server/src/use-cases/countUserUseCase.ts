import { prisma } from '../lib/prisma';

export async function countUserUseCase(): Promise<{ count: number }> {
  const count = await prisma.user.count();
  return { count };
}
