import { hashPassword } from '../auth/hashPassword';
import { alice, bob } from '../config/seedConfig.js';
import { prisma } from '../prisma/prisma';

async function seed() {
  console.log('Seeding database...');

  await prisma.user.upsert({
    where: { username: alice.username },
    update: {},
    create: {
      username: alice.username,
      password: await hashPassword(alice.password),
      displayName: alice.displayName,
    },
  });

  await prisma.user.upsert({
    where: { username: bob.username },
    update: {},
    create: {
      username: bob.username,
      password: await hashPassword(bob.password),
      displayName: bob.displayName,
    },
  });

  console.log('Done!');
}

void (async () => {
  try {
    await seed();
  } catch (err) {
    console.error(err);
  }
})();
