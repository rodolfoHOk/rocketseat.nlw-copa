import { Guess } from '@prisma/client';
import { ValidationError } from '../errors/ValidationError';
import { prisma } from '../lib/prisma';

export async function createGuessUseCase(
  pollId: string,
  gameId: string,
  userId: string,
  firstTeamPoints: number,
  secondTeamPoints: number
): Promise<Guess> {
  const participant = await prisma.participant.findUnique({
    where: {
      userId_pollId: {
        pollId,
        userId,
      },
    },
  });

  if (!participant) {
    throw new ValidationError(
      'You are not allowed to make a guess in this pool.'
    );
  }

  let guess = await prisma.guess.findUnique({
    where: {
      participantId_gameId: {
        participantId: participant.id,
        gameId,
      },
    },
  });

  if (guess) {
    throw new ValidationError("You've already made a guess on this game.");
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });

  if (!game) {
    throw new ValidationError('Game not found');
  }

  if (game.date < new Date()) {
    throw new ValidationError('You cannot make a guess after the game date.');
  }

  return await prisma.guess.create({
    data: {
      firstTeamPoints,
      secondTeamPoints,
      gameId,
      participantId: participant.id,
    },
  });
}
