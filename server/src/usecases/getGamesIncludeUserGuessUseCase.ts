import { Guess } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface GameIncludeUserGuess {
  id: string;
  date: Date;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: Guess | null;
}

export async function getGamesIncludeUserGuessUseCase(
  pollId: string,
  userId: string
): Promise<{ games: GameIncludeUserGuess[] }> {
  const games = await prisma.game.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
      guesses: {
        where: {
          participant: {
            userId,
            pollId,
          },
        },
      },
    },
  });

  return {
    games: games.map((game) => {
      return {
        ...game,
        guess: game.guesses.length > 0 ? game.guesses[0] : null,
        guesses: undefined,
      };
    }),
  };
}
