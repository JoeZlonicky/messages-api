import { hashPassword } from '../../auth/hashPassword';
import { prisma } from '../../prisma/prisma';
import type { Prisma, User } from '@prisma/client';

async function useTestUsers(
  userData: Prisma.UserCreateInput[],
): Promise<User[]> {
  const userDataWithHashedPasswords = await Promise.all(
    userData.map(async (data) => {
      return {
        ...data,
        password: await hashPassword(data.password),
      };
    }),
  );

  await prisma.user.createMany({
    data: userDataWithHashedPasswords,
    skipDuplicates: true,
  });

  const usernames = userData.map((data) => data.username);

  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
    },
  });

  return users;
}

export { useTestUsers };
