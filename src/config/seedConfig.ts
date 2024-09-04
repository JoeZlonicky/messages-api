import type { Prisma } from '@prisma/client';

const alice: Prisma.UserCreateInput = {
  username: 'alice123',
  password: '12345678',
  displayName: 'Alice',
};

const bob: Prisma.UserCreateInput = {
  username: 'bob123',
  password: '12345678',
  displayName: 'Bob',
};

const caitlin: Prisma.UserCreateInput = {
  username: 'caitlin123',
  password: '12345678',
  displayName: 'Caitlin',
};

const messages = {
  aliceToServer: 'Hi, server!',
  bobToServer: 'Glad to be here!',
  aliceToCaitlin: 'Hi, Caitlin',
  caitlinToAlice: 'Hey!',
  caitlinToBob: 'Hi, Bob!',
};

export { alice, bob, caitlin, messages };
