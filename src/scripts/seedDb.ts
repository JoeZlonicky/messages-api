import { hashPassword } from '../auth/hashPassword';
import { alice, bob, caitlin, messages } from '../config/seedConfig.js';
import { prisma } from '../prisma/prisma';
import type { Prisma, User } from '@prisma/client';

async function upsertUser(userConfig: Prisma.UserCreateInput) {
  return await prisma.user.upsert({
    where: { username: userConfig.username },
    update: {},
    create: {
      username: userConfig.username,
      password: await hashPassword(userConfig.password),
      displayName: userConfig.displayName,
    },
  });
}

async function createMessageIfDoesntExist(
  content: string,
  from: User,
  to: User | null,
) {
  const aliceToServerMessage = await prisma.message.findFirst({
    where: {
      content: content,
      fromUser: from,
      toUser: null,
    },
  });
  if (!aliceToServerMessage) {
    await prisma.message.create({
      data: {
        content: content,
        fromUserId: from.id,
        toUserId: to ? to.id : undefined,
      },
    });
  }
}

async function seed() {
  console.log('Seeding database...');

  const aliceUser = await upsertUser(alice);
  const bobUser = await upsertUser(bob);
  const caitlinUser = await upsertUser(caitlin);

  await createMessageIfDoesntExist(messages.aliceToServer, aliceUser, null);
  await createMessageIfDoesntExist(messages.bobToServer, bobUser, null);
  await createMessageIfDoesntExist(
    messages.aliceToCaitlin,
    aliceUser,
    caitlinUser,
  );
  await createMessageIfDoesntExist(
    messages.caitlinToAlice,
    caitlinUser,
    aliceUser,
  );
  await createMessageIfDoesntExist(messages.caitlinToBob, caitlinUser, bobUser);

  console.log('Done!');
}

void (async () => {
  try {
    await seed();
  } catch (err) {
    console.error(err);
  }
})();
