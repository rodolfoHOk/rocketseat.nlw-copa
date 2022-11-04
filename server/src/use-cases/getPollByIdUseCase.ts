import { prisma } from '../lib/prisma';

interface PollsDetails {
  id: string;
  title: string;
  code: string;
  ownerId: string;
  createdAt: Date;
  participants: {
    id: string;
    user: {
      avatarUrl: string | null;
    };
  }[];
  owner: {
    id: string;
    name: string;
  };
  _count: {
    participants: number;
  };
}

export async function getPollByIdUseCase(
  id: string
): Promise<{ poll: PollsDetails | null }> {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
      participants: {
        select: {
          id: true,
          user: {
            select: {
              avatarUrl: true,
            },
          },
        },
        take: 4,
      },
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { poll };
}
