import { JWT } from '@fastify/jwt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function authenticateUserUseCase(
  googleAccessToken: string,
  jwt: JWT
): Promise<{ token: string }> {
  const userResponse = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    }
  );
  const userData = await userResponse.json();

  const userInfoSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    picture: z.string().url(),
  });
  const userInfo = userInfoSchema.parse(userData);

  let user = await prisma.user.findUnique({
    where: {
      googleId: userInfo.id,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        googleId: userInfo.id,
        name: userInfo.name,
        avatarUrl: userInfo.picture,
      },
    });
  }

  const token = jwt.sign(
    {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    {
      sub: user.id,
      expiresIn: '2 days',
    }
  );

  return { token };
}
