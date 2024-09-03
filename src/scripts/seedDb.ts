import { prisma } from '../prisma/prisma';
import { hashPassword } from '../utility/hashPassword';

async function seed() {
  await prisma.user.upsert({
    where: { username: 'alice123' },
    update: {},
    create: {
      username: 'alice123',
      password: await hashPassword('1234'),
      displayName: 'Alice',
    },
  });
}

void (async () => {
  try {
    await seed();
  } catch (err) {
    console.error(err);
  }
})();
