import { prisma } from '../../prisma/prisma';
import { hashPassword } from '../auth/hashPassword';
import type { Prisma, User } from '@prisma/client';

const testUserData: Prisma.UserCreateInput[] = [
  {
    username: 'alice123',
    password: '12345678',
    displayName: 'Alice',
  },
  {
    username: 'bob234',
    password: '12345678',
    displayName: 'Bob',
  },
  {
    username: 'caitlin345',
    password: '12345678',
    displayName: 'Caitlin',
  },
];

async function useTestUser(
  index: 0 | 1 | 2,
): Promise<[User, Prisma.UserCreateInput]> {
  const userData = testUserData[index]!;

  const user = await prisma.user.upsert({
    where: {
      username: userData.username,
    },
    update: {
      displayName: userData.displayName,
    },
    create: {
      username: userData.username,
      password: await hashPassword(userData.password),
      displayName: userData.displayName,
    },
  });

  return [user, userData];
}

export { useTestUser };
