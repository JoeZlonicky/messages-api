import { prisma } from '../prisma/prisma';
import { hashPassword } from '../utility/auth/hashPassword';
import type { User } from '@prisma/client';

async function upsertUser(
  username: string,
  password: string,
  displayName: string,
) {
  return await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: await hashPassword(password),
      displayName,
    },
  });
}

// Doesn't "truly" upsert because content is not unique
async function upsertMessage(content: string, from: User, to: User | null) {
  const message = await prisma.message.findFirst({
    where: {
      content: content,
      fromUser: from,
      toUser: null,
    },
  });

  if (message) {
    return;
  }

  await prisma.message.create({
    data: {
      content: content,
      fromUserId: from.id,
      toUserId: to ? to.id : undefined,
    },
  });
}

async function seed() {
  console.log('Seeding database...');

  const aliceUser = await upsertUser('alice123', '12345678', 'Alice');
  const bobUser = await upsertUser('bob123', '12345678', 'Bob');
  const caitlinUser = await upsertUser('caitlin123', '12345678', 'Caitlin');

  await upsertMessage('Hi, server!', aliceUser, null);
  await upsertMessage('Glad to be here!', bobUser, null);
  await upsertMessage('Hi, Caitlin', aliceUser, caitlinUser);
  await upsertMessage('Hey!', caitlinUser, aliceUser);
  await upsertMessage('Hi, Bob!', caitlinUser, bobUser);

  console.log('Done!');
}

void (async () => {
  try {
    await seed();
  } catch (err) {
    console.error(err);
  }
})();
